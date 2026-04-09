import { useApolloClient, useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import useForm from '../lib/useForm';
import Error from './ErrorMessage';
import Form from './styles/Form';
import { CURRENT_USER_QUERY } from './User';

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    authenticateUserWithPassword(email: $email, password: $password) {
      ... on UserAuthenticationWithPasswordSuccess {
        item {
          id
          email
          name
        }
      }
      ... on UserAuthenticationWithPasswordFailure {
        code
        message
      }
    }
  }
`;

export default function SignIn() {
  const router = useRouter();
  const client = useApolloClient();
  const initialValues = useMemo(
    () => ({
      email: '',
      password: ''
    }),
    []
  );

  const { inputs, handleChange, resetForm } = useForm(initialValues);

  const [signin, { data, loading, error: mutationError }] = useMutation(SIGNIN_MUTATION, {
    variables: inputs,

    // refetch the currently logged in user
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
    awaitRefetchQueries: true
  });

  async function handleSubmit(e) {
    e.preventDefault(); // Prevent the form from submitting
    console.log('Sign in attempt with:', inputs);

    // Basic validation
    if (!inputs.email || !inputs.password) {
      console.log('Email and password are required');
      return;
    }

    try {
      const res = await signin();
      console.log('Sign in result:', res);

      // Check if sign in was successful
      const authResult = res.data?.authenticateUserWithPassword;
      if (authResult?.__typename === 'UserAuthenticationWithPasswordSuccess') {
        console.log('Sign in successful for user:', authResult.item);

        // Manually update the Apollo cache with the authenticated user
        // Provide complete data structure matching the query
        client.writeQuery({
          query: CURRENT_USER_QUERY,
          data: {
            authenticatedItem: {
              __typename: 'User',
              id: authResult.item.id,
              email: authResult.item.email,
              name: authResult.item.name,
              cart: [] // Empty cart for new users
            }
          }
        });

        resetForm();
        // Small delay to ensure cache updates are processed
        setTimeout(() => {
          // Redirect to home page after successful sign-in
          router.push('/');
        }, 100);
      } else if (authResult?.__typename === 'UserAuthenticationWithPasswordFailure') {
        console.log('Sign in failed:', authResult.message);
      }
    } catch (error) {
      console.error('Sign in error:', error);
    }
  }
  const error =
    data?.authenticateUserWithPassword.__typename === 'UserAuthenticationWithPasswordFailure'
      ? data?.authenticateUserWithPassword
      : mutationError;
  return (
    <Form method="POST" onSubmit={handleSubmit}>
      <h2>Sign into your account</h2>
      <Error error={error} />
      <fieldset disabled={loading} aria-busy={loading}>
        <label htmlFor="email">
          Email
          <input
            type="email"
            name="email"
            placeholder="Your email address"
            autoComplete="email"
            value={inputs.email}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="password">
          Password
          <input
            type="password"
            name="password"
            placeholder="password"
            autoComplete="current-password"
            value={inputs.password}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Sign In</button>
      </fieldset>
    </Form>
  );
}
