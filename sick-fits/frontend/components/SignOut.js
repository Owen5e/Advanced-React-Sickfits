import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import React from 'react';
import { CURRENT_USER_QUERY } from './User';

const SIGN_OUT_MUTATION = gql`
  mutation SIGN_OUT_MUTATION {
    endSession
  }
`;

export default function SignOut() {
  const [signout] = useMutation(SIGN_OUT_MUTATION, {
    refetchQueries: [{ query: CURRENT_USER_QUERY }]
  });
  return (
    <button
      type="button"
      onClick={signout}
      style={{
        background: '#dc2626',
        color: 'white',
        border: 'none',
        padding: '0.75rem 1.5rem',
        borderRadius: '4px',
        fontSize: '1rem',
        cursor: 'pointer',
        transition: 'background 0.2s'
      }}
      onMouseOver={e => (e.currentTarget.style.background = '#b91c1c')}
      onMouseOut={e => (e.currentTarget.style.background = '#dc2626')}
    >
      Sign Out
    </button>
  );
}