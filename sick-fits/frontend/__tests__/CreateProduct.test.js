import {render, screen, waitFor } from '@testing-library/react';
import {MockedProvider} from '@apollo/client/testing';
import userEvent from '@testing-library/user-event';
import Router from 'next/router'; //we will mock this
import CreateProduct, {CREATE_PRODUCT_MUTATION} from '../components/CreateProduct';
import { ALL_PRODUCTS_QUERY } from '../components/Products';
import {fakeItem, makePaginationMocksFor} from '../lib/testUtils';
import wait from 'waait';

const item = fakeItem();

jest.mock('next/router', () => ({
    push: jest.fn(),
}))

describe('<CreateProduct/>', () => {
    it('renders and matches snapshot', () => {
        const {container, debug} = render(
                <MockedProvider>
                    <CreateProduct/>
                </MockedProvider>
            );
            expect(container).toMatchSnapshot();
    });
    it('handles the updating', async () => {
        //1. render the form out
const {container, debug} = render(
                <MockedProvider>
                    <CreateProduct/>
                </MockedProvider>
            );
        //2. type into the inputs
        await userEvent.type(screen.getByPlaceholderText(/Name/i), item.name);
        await userEvent.type(screen.getByPlaceholderText(/Price/i), item.price.toString());
        await userEvent.type(screen.getByPlaceholderText(/Description/i), item.description);
        //3. check that the values have been updated
        expect(screen.getByDisplayValue(item.name)).toBeInTheDocument();
        expect(screen.getByDisplayValue(item.price.toString())).toBeInTheDocument();
        expect(screen.getByDisplayValue(item.description)).toBeInTheDocument();
    });
    it('creates the items when the form is submitted', async () => {
        //create the mocks for this one
        const mocks = [
            {
                request: {
                    query: CREATE_PRODUCT_MUTATION,
                    variables: {
                        name: item.name,
                        description: item.description,
                        price: item.price,
                        image: '',
                    },
                },
                result: {
                    data: {
                        createProduct: {
                            ...item, // all fake item fields
                            id: 'abc123',
                            __typename: 'Item',
                        },
                    },
                },
            },
            {
                request: {
                    query: ALL_PRODUCTS_QUERY,
                    variables: {skip: 0, first: 2}, //from makePaginationMocksFor
                },
                result: {
                    data: {
                        allProducts: [item],
                    },
                },
            }
        ];
        const {container, debug} = render(
                <MockedProvider mocks={mocks}>
                    <CreateProduct/>
                </MockedProvider>
            );
             //2. type into the inputs
        await userEvent.type(screen.getByPlaceholderText(/Name/i), item.name);
        await userEvent.type(screen.getByPlaceholderText(/Price/i), item.price.toString());
        await userEvent.type(screen.getByPlaceholderText(/Description/i), item.description);
        // Submit and see if the page change has been called
        await userEvent.click(screen.getByText(/Add Product/));
        await waitFor(() => wait(1)); // wait for response
        expect(Router.push).toHaveBeenCalled();
        expect(Router.push).toHaveBeenCalledWith({
            pathname: `/product/abc123`,
        });
    });
});