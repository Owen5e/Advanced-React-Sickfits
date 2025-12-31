import {render, screen } from "@testing-library/react";
import {MockedProvider} from "@apollo/client/testing";
import userEvent from "@testing-library/user-event";
import Signup, {SIGNUP_MUTATION} from "../components/SignUp";
import { CURRENT_USER_QUERY } from "../components/User";
import { fakeUser } from "../lib/testUtils";

const me = fakeUser();
const password = 'test123';

const mocks = [
    // Mutation mocks
    {
        request: {
            query: SIGNUP_MUTATION,
            variables: {
                name: me.name,
                email: me.email,    
                password: password,
            },
        },
        result: {
            data: {
                createUser: {
                    __typename: 'User',
                    id: 'abc123',
                    email: me.email,
                    name: me.name,
                },
            },
        },
    },
    // current user mock
    {
        request: { query: CURRENT_USER_QUERY },
        result: { data: { authenticatedItem: me } },
    },
];

describe('<SignUp/>', () => {
    it('renders and matches snapshot', () =>  {
    const {container} = render(
        <MockedProvider>
            <Signup/>
        </MockedProvider>
    );
    expect(container).toMatchSnapshot();
     });
     it('calls the mutation properly', async () => {
        const {container, debug} = render(
        <MockedProvider mocks={mocks}>
            <Signup/>
        </MockedProvider>
    );
// type into the inputs
    await userEvent.type(screen.getByPlaceholderText(/name/i), me.name);
    await userEvent.type(screen.getByPlaceholderText(/email/i), me.email);
    await userEvent.type(screen.getByPlaceholderText(/password/i), password);
    // click the sign up button
    await userEvent.click(screen.getByText('Sign Up'));
    await screen.findByText(`Signed up with ${me.email} - Pls go ahead and sign in`);
    debug();
     });
});



