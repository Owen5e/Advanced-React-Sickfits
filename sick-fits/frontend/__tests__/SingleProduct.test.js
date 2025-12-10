/* eslint-disable */
import { render, screen } from "@testing-library/react";
import SingleProduct, { SINGLE_PRODUCT_QUERY } from "../components/SingleProduct";
import { fakeItem } from "../lib/testUtils";
import { MockedProvider } from "@apollo/react-testing";

const product = fakeItem();
const mocks = [
    {
        // when someone requests this query with these variables
        request: {
            query: SINGLE_PRODUCT_QUERY, 
            variables: {
                id: '123',
            },
        },
        // return this data
        result: {
            data: {
                Product: product,
            },
        },
    }
];


describe('<SingleProduct/>', () => {
    it('renders with proper data', async() => {
        // we need to make some fake data
        const {container, debug} = render(
            <MockedProvider mocks={mocks}>
                <SingleProduct id='123'/>
            </MockedProvider>
        );
        // wait for test id to show up
        await screen.findByTestId('singleProduct');
        expect(container).toMatchSnapshot();
    });

    it('errors out when an item is not found', async() => {
        const errorMocks = [
        {
                  request: {
            query: SINGLE_PRODUCT_QUERY, 
            variables: {
                id: '123',
            },
        },
        result: {
            errors: [{message: 'Item not found!!!'}],
        },
        }
        ];
         const {container, debug} = render(
            <MockedProvider mocks={errorMocks}>
                <SingleProduct id='123'/>
            </MockedProvider>
        );
        await screen.findByTestId('graphql-error');
        expect (container).toHaveTextContent('Shoot!')
        expect (container).toHaveTextContent('Item not found!!!')
    });
});
