
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import Stripe from 'https://esm.sh/stripe@12.18.0?target=deno';

// Initialize Stripe with the secret key
const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
});

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Serve HTTP requests
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Extract the token from the authorization header (Bearer token)
    const token = authHeader.replace('Bearer ', '');

    // Create a Supabase client with the user's JWT
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_ANON_KEY') || '',
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    );

    // Get the user's ID from the JWT
    const {
      data: { user },
    } = await supabaseClient.auth.getUser(token);

    if (!user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get the request data
    const { action, ...data } = await req.json();

    // Only allow authenticated requests
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('id, is_creator, creator_username, stripe_account_id')
      .eq('id', user.id)
      .single();

    if (!profile) {
      return new Response(JSON.stringify({ error: 'User profile not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let result;

    // Handle different actions
    switch (action) {
      case 'create_account':
        // Only creators can create Stripe accounts
        if (!profile.is_creator) {
          return new Response(JSON.stringify({ error: 'Only creators can create Stripe accounts' }), {
            status: 403,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        // Check if the user already has a Stripe account
        if (profile.stripe_account_id) {
          // Get the account information
          const account = await stripe.accounts.retrieve(profile.stripe_account_id);
          return new Response(JSON.stringify({ accountId: profile.stripe_account_id, account }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        // Create a new Stripe Connect account
        const account = await stripe.accounts.create({
          type: 'express',
          country: data.country || 'US',
          email: user.email,
          capabilities: {
            card_payments: { requested: true },
            transfers: { requested: true },
          },
          business_type: 'individual',
          business_profile: {
            url: `https://example.com/creator/${profile.creator_username}`,
          },
        });

        // Store the account ID in the user's profile
        await supabaseClient
          .from('profiles')
          .update({ stripe_account_id: account.id })
          .eq('id', user.id);

        result = { accountId: account.id, account };
        break;

      case 'create_managed_account':
        // Only creators can create Stripe accounts
        if (!profile.is_creator) {
          return new Response(JSON.stringify({ error: 'Only creators can create Stripe accounts' }), {
            status: 403,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        // Create a new Managed Stripe Connect account
        const managedAccount = await stripe.accounts.create({
          type: 'express',
          country: data.country || 'US',
          email: user.email,
          capabilities: {
            card_payments: { requested: true },
            transfers: { requested: true },
          },
          business_type: 'individual',
          controller: {
            stripe_dashboard: {
              type: "none",
            },
            fees: {
              payer: "application"
            },
            losses: {
              payments: "application"
            },
            requirement_collection: "application",
          },
          business_profile: {
            url: `https://example.com/creator/${profile.creator_username}`,
          },
        });

        // Store the account ID in the user's profile
        await supabaseClient
          .from('profiles')
          .update({ stripe_account_id: managedAccount.id })
          .eq('id', user.id);

        result = { accountId: managedAccount.id, account: managedAccount };
        break;

      case 'update_account':
        // Only creators can update Stripe accounts
        if (!profile.is_creator) {
          return new Response(JSON.stringify({ error: 'Only creators can update Stripe accounts' }), {
            status: 403,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        // Check if the account ID matches the user's account
        const accountId = data.accountId;
        
        if (!accountId || (profile.stripe_account_id && profile.stripe_account_id !== accountId)) {
          return new Response(JSON.stringify({ error: 'Invalid account ID' }), {
            status: 403,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        // Update the Stripe account
        const updatedAccount = await stripe.accounts.update(
          accountId,
          {
            business_type: data.business_type || 'individual',
            // You can add more update fields here from the data object
          }
        );

        result = { accountId: updatedAccount.id, account: updatedAccount };
        break;

      case 'create_onboarding_link':
        // Check if the user has a Stripe account
        if (!profile.stripe_account_id) {
          return new Response(JSON.stringify({ error: 'User does not have a Stripe account' }), {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        // Create an account link for onboarding
        const accountLink = await stripe.accountLinks.create({
          account: profile.stripe_account_id,
          refresh_url: `${data.returnUrl || 'https://example.com/creator/dashboard'}?refresh=true`,
          return_url: `${data.returnUrl || 'https://example.com/creator/dashboard'}?success=true`,
          type: 'account_onboarding',
        });

        result = { url: accountLink.url };
        break;

      case 'create_oauth_link':
        // Only creators can connect Stripe accounts
        if (!profile.is_creator) {
          return new Response(JSON.stringify({ error: 'Only creators can connect Stripe accounts' }), {
            status: 403,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        // Create an OAuth link for connecting an existing Stripe account
        const state = Math.random().toString(36).substring(2, 15);
        
        // Store the state temporarily to verify the callback
        const { error: stateError } = await supabaseClient
          .from('creator_onboarding')
          .upsert({
            user_id: user.id,
            creator_username: profile.creator_username || `user_${user.id.substring(0, 8)}`,
            oauth_state: state
          })
          .select();

        if (stateError) {
          throw new Error(`Failed to store OAuth state: ${stateError.message}`);
        }

        // Generate the OAuth URL
        const clientId = Deno.env.get('STRIPE_CLIENT_ID');
        if (!clientId) {
          throw new Error('STRIPE_CLIENT_ID is not set');
        }

        const redirectUri = encodeURIComponent(data.returnUrl || 'https://example.com/creator/onboarding');
        const oauthUrl = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${clientId}&scope=read_write&redirect_uri=${redirectUri}&state=${state}`;
        
        result = { url: oauthUrl };
        break;

      case 'handle_oauth_callback':
        // Verify the code from Stripe OAuth
        if (!data.code) {
          return new Response(JSON.stringify({ error: 'Authorization code is required' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        // Exchange the authorization code for an access token
        const clientId = Deno.env.get('STRIPE_CLIENT_ID');
        const secretKey = Deno.env.get('STRIPE_SECRET_KEY');
        
        if (!clientId || !secretKey) {
          throw new Error('Stripe configuration is missing');
        }

        // Call the Stripe API to exchange the code for an access token
        const tokenResponse = await fetch('https://connect.stripe.com/oauth/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            client_secret: secretKey,
            grant_type: 'authorization_code',
            code: data.code,
          }),
        });

        const tokenData = await tokenResponse.json();
        
        if (tokenData.error) {
          throw new Error(`Stripe OAuth error: ${tokenData.error_description || tokenData.error}`);
        }

        // Store the connected account ID in the user's profile
        await supabaseClient
          .from('profiles')
          .update({ stripe_account_id: tokenData.stripe_user_id })
          .eq('id', user.id);

        result = { 
          success: true, 
          accountId: tokenData.stripe_user_id 
        };
        break;

      case 'get_account_status':
        // Check if the user has a Stripe account
        if (!profile.stripe_account_id) {
          return new Response(JSON.stringify({ error: 'User does not have a Stripe account' }), {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        // Get the account information
        const accountStatus = await stripe.accounts.retrieve(profile.stripe_account_id);
        result = { account: accountStatus };
        break;

      case 'create_payment_intent':
        // Validate the request
        if (!data.amount || !data.creatorId) {
          return new Response(JSON.stringify({ error: 'Missing required fields' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        // Get the creator's Stripe account ID
        const { data: creatorProfile } = await supabaseClient
          .from('profiles')
          .select('stripe_account_id')
          .eq('id', data.creatorId)
          .single();

        if (!creatorProfile || !creatorProfile.stripe_account_id) {
          return new Response(JSON.stringify({ error: 'Creator does not have a Stripe account' }), {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        // Calculate the platform fee (20%)
        const amount = parseInt(data.amount);
        const platformFee = Math.round(amount * 0.2);

        // Create a payment intent
        const paymentIntent = await stripe.paymentIntents.create({
          amount: amount,
          currency: 'usd',
          automatic_payment_methods: { enabled: true },
          application_fee_amount: platformFee,
          transfer_data: {
            destination: creatorProfile.stripe_account_id,
          },
          metadata: {
            user_id: user.id,
            creator_id: data.creatorId,
            tribute_type: data.tributeType || 'standard',
          },
        });

        result = { clientSecret: paymentIntent.client_secret };
        break;

      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

    // Return the result
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
