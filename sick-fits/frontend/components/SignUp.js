import { useApolloClient, useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import useForm from '../lib/useForm';
import Error from './ErrorMessage';
import Form from './styles/Form';
import { CURRENT_USER_QUERY } from './User';

const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION($name: String!, $email: String!, $password: String!) {
    createUser(data: { email: $email, password: $password, name: $name }) {
      id
      email
      name
    }
  }
`;

export default function SignUp() {
  const router = useRouter();
  const client = useApolloClient();
  const initialValues = useMemo(
    () => ({
      name: '',
      email: '',
      password: ''
    }),
    []
  );

  const { inputs, handleChange, resetForm } = useForm(initialValues);

  const [signup, { data, loading, error: mutationError }] = useMutation(SIGNUP_MUTATION, {
    variables: inputs,

    // refetch the currently logged in user
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
    awaitRefetchQueries: true
  });

  async function handleSubmit(e) {
    e.preventDefault(); // Prevent the form from submitting
    console.log('Sign up attempt with:', inputs);

    // Basic validation
    if (!inputs.name || !inputs.email || !inputs.password) {
      console.log('Name, email and password are required');
      return;
    }

    try {
      const res = await signup();
      console.log('Sign up result:', res);

      // Check if sign up was successful
      if (res.data?.createUser) {
        console.log('Sign up successful for user:', res.data.createUser);

        // Manually update the Apollo cache with the authenticated user
        client.writeQuery({
          query: CURRENT_USER_QUERY,
          data: {
            authenticatedItem: {
              __typename: 'User',
              id: res.data.createUser.id,
              email: res.data.createUser.email,
              name: res.data.createUser.name,
              cart: [] // Empty cart for new users
            }
          }
        });

        resetForm();
        // Small delay to ensure cache updates are processed
        setTimeout(() => {
          // Redirect to home page after successful sign-up
          router.push('/');
        }, 100);
      }
    } catch (error) {
      console.error('Sign up error:', error);
      // Error will be displayed by the Error component
    }
  }
  const error = mutationError; // Use the mutation error
  return (
    <Form method="POST" onSubmit={handleSubmit}>
      <h2>Sign Up For an Account</h2>
      <Error error={error} />
      <fieldset disabled={loading} aria-busy={loading}>
        {data?.createUser && (
          <p>Signed up with {data.createUser.email} - Pls go ahead and sign in</p>
        )}
        <label htmlFor="name">
          Name
          <input
            type="text"
            name="name"
            placeholder="Your name"
            autoComplete="name"
            value={inputs.name}
            onChange={handleChange}
          />
        </label>
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
        <button type="submit">Sign Up</button>
      </fieldset>
    </Form>
  );
}

export { SIGNUP_MUTATION };
