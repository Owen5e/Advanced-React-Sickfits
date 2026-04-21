import { useMutation, useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import Head from 'next/head';
import Link from 'next/link';
import styled from 'styled-components';
import ErrorMessage from '../components/ErrorMessage';
import Form from '../components/styles/Form';
import { CURRENT_USER_QUERY } from '../components/User';
import useForm from '../lib/useForm';

const AccountContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const AccountSection = styled.section`
  margin-bottom: 3rem;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: var(--black);
  border-bottom: 2px solid var(--lightGray);
  padding-bottom: 0.5rem;
`;

const UserInfo = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const InfoItem = styled.div`
  margin-bottom: 1rem;
`;

const InfoLabel = styled.span`
  font-weight: bold;
  color: var(--gray);
  display: block;
  margin-bottom: 0.25rem;
`;

const InfoValue = styled.span`
  font-size: 1.1rem;
  color: var(--black);
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
`;

const StatCard = styled.div`
  background: var(--lightGray);
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: var(--red);
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: var(--gray);
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const ActionButton = styled.button`
  background: var(--red);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: var(--darkRed);
  }

  &:disabled {
    background: var(--gray);
    cursor: not-allowed;
  }
`;

const UPDATE_USER_MUTATION = gql`
  mutation UPDATE_USER_MUTATION($id: ID!, $name: String, $email: String) {
    updateUser(id: $id, data: { name: $name, email: $email }) {
      id
      name
      email
    }
  }
`;

const UPDATE_PASSWORD_MUTATION = gql`
  mutation UPDATE_PASSWORD_MUTATION($id: ID!, $password: String) {
    updateUser(id: $id, data: { password: $password }) {
      id
    }
  }
`;

export default function AccountPage() {
  const { data, error, loading } = useQuery(CURRENT_USER_QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <ErrorMessage error={error} />;

  const user = data?.authenticatedItem;

  if (!user) {
    return (
      <AccountContainer>
        <Head>
          <title>Account | Sick Fits</title>
        </Head>
        <AccountSection>
          <SectionTitle>Account</SectionTitle>
          <p>Please sign in to view your account.</p>
          <Link href="/signin">
            <ActionButton>Sign In</ActionButton>
          </Link>
        </AccountSection>
      </AccountContainer>
    );
  }

  // For the update form
  const { inputs: updateInputs, handleChange: handleUpdateChange } = useForm({
    name: user.name || '',
    email: user.email || ''
  });

  // For the password form
  const {
    inputs: passwordInputs,
    handleChange: handlePasswordChange,
    resetForm: resetPasswordForm
  } = useForm({
    password: '',
    confirmPassword: ''
  });

  const [updateUser, { loading: updateLoading, error: updateError }] = useMutation(
    UPDATE_USER_MUTATION,
    {
      refetchQueries: [{ query: CURRENT_USER_QUERY }]
    }
  );

  const [updatePassword, { loading: passwordLoading, error: passwordError }] = useMutation(
    UPDATE_PASSWORD_MUTATION,
    {
      refetchQueries: [{ query: CURRENT_USER_QUERY }]
    }
  );

  const handleUpdateSubmit = async e => {
    e.preventDefault();
    await updateUser({
      variables: {
        id: user.id,
        name: updateInputs.name,
        email: updateInputs.email
      }
    });
  };

  const handlePasswordSubmit = async e => {
    e.preventDefault();
    if (passwordInputs.password !== passwordInputs.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    await updatePassword({
      variables: {
        id: user.id,
        password: passwordInputs.password
      }
    });
    resetPasswordForm();
    alert('Password updated successfully');
  };

  return (
    <AccountContainer>
      <Head>
        <title>Account | Sick Fits</title>
      </Head>

      <AccountSection>
        <SectionTitle>Account Overview</SectionTitle>
        <UserInfo>
          <InfoItem>
            <InfoLabel>Name</InfoLabel>
            <InfoValue>{user.name}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Email</InfoLabel>
            <InfoValue>{user.email}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Account ID</InfoLabel>
            <InfoValue>{user.id}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Member Since</InfoLabel>
            <InfoValue>Active account</InfoValue>
          </InfoItem>
        </UserInfo>

        <StatsGrid>
          <StatCard>
            <StatNumber>{user.cart?.length || 0}</StatNumber>
            <StatLabel>Items in Cart</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{user.orders?.length || 0}</StatNumber>
            <StatLabel>Total Orders</StatLabel>
            <Link href="/order">
              <ActionButton style={{ marginTop: '1rem', width: '100%' }}>View Orders</ActionButton>
            </Link>
          </StatCard>
          <StatCard>
            <StatNumber>{user.products?.length || 0}</StatNumber>
            <StatLabel>Products Listed</StatLabel>
            <Link href="/sell">
              <ActionButton style={{ marginTop: '1rem', width: '100%' }}>
                Sell Products
              </ActionButton>
            </Link>
          </StatCard>
        </StatsGrid>
      </AccountSection>

      <AccountSection>
        <SectionTitle>Update Profile</SectionTitle>
        {updateError && <ErrorMessage error={updateError} />}
        <Form onSubmit={handleUpdateSubmit}>
          <fieldset disabled={updateLoading} aria-busy={updateLoading}>
            <label htmlFor="name">
              Name
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Your Name"
                value={updateInputs.name}
                onChange={handleUpdateChange}
              />
            </label>
            <label htmlFor="email">
              Email
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Your Email Address"
                value={updateInputs.email}
                onChange={handleUpdateChange}
              />
            </label>
            <ActionButton type="submit">
              {updateLoading ? 'Updating...' : 'Update Profile'}
            </ActionButton>
          </fieldset>
        </Form>
      </AccountSection>

      <AccountSection>
        <SectionTitle>Change Password</SectionTitle>
        {passwordError && <ErrorMessage error={passwordError} />}
        <Form onSubmit={handlePasswordSubmit}>
          <fieldset disabled={passwordLoading} aria-busy={passwordLoading}>
            <label htmlFor="password">
              New Password
              <input
                type="password"
                id="password"
                name="password"
                placeholder="New Password"
                value={passwordInputs.password}
                onChange={handlePasswordChange}
              />
            </label>
            <label htmlFor="confirmPassword">
              Confirm New Password
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm New Password"
                value={passwordInputs.confirmPassword}
                onChange={handlePasswordChange}
              />
            </label>
            <ActionButton type="submit">
              {passwordLoading ? 'Updating...' : 'Change Password'}
            </ActionButton>
          </fieldset>
        </Form>
      </AccountSection>

      <AccountSection>
        <SectionTitle>Account Actions</SectionTitle>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/order">
            <ActionButton>View All Orders</ActionButton>
          </Link>
          <Link href="/sell">
            <ActionButton>Sell Products</ActionButton>
          </Link>
          <Link href="/reset">
            <ActionButton>Reset Password</ActionButton>
          </Link>
        </div>
      </AccountSection>
    </AccountContainer>
  );
}
