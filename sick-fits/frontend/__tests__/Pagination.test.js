/* eslint-disable */
import { screen, render } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import Pagination from '../components/Pagination';
import { makePaginationMocksFor } from '../lib/testUtils';
import { perPage } from '../config';

// The page count is derived from `count / perPage`, so the fixtures below are
// built from the real perPage value rather than a hard-coded product count.
const pages = 3;

describe('<Pagination/>', () => {
  it('displays a loading message', () => {
    const { container } = render(
      <MockedProvider mocks={makePaginationMocksFor(1)}>
        <Pagination />
      </MockedProvider>
    );
    expect(container).toHaveTextContent('Loading...');
  });
  it('renders pagination for a full page of items', async () => {
    const { container } = render(
      <MockedProvider mocks={makePaginationMocksFor(perPage)}>
        <Pagination page={1} />
      </MockedProvider>
    );
    await screen.findByTestId('pagination');
    const pageCountSpan = screen.getByTestId('pageCount');
    expect(pageCountSpan).toHaveTextContent('1');
    expect(container).toHaveTextContent('page 1 of 1');
    expect(container).toHaveTextContent(`${perPage} Items Total`);
    expect(container).toMatchSnapshot();
  });
  it('disables the prev button on page 1', async () => {
    const { container } = render(
      <MockedProvider mocks={makePaginationMocksFor(perPage * pages)}>
        <Pagination page={1} />
      </MockedProvider>
    );
    await screen.findByTestId('pagination');
    const prevButton = screen.getByText(/Prev/);
    const nextButton = screen.getByText(/Next/);
    expect(prevButton).toHaveAttribute('aria-disabled', 'true');
    expect(nextButton).toHaveAttribute('aria-disabled', 'false');
  });
  it('disables the next button on last page', async () => {
    const { container } = render(
      <MockedProvider mocks={makePaginationMocksFor(perPage * pages)}>
        <Pagination page={pages} />
      </MockedProvider>
    );
    await screen.findByTestId('pagination');
    const prevButton = screen.getByText(/Prev/);
    const nextButton = screen.getByText(/Next/);
    expect(prevButton).toHaveAttribute('aria-disabled', 'false');
    expect(nextButton).toHaveAttribute('aria-disabled', 'true');
  });
  it('enables all on middle page', async () => {
    const { container } = render(
      <MockedProvider mocks={makePaginationMocksFor(perPage * pages)}>
        <Pagination page={2} />
      </MockedProvider>
    );
    await screen.findByTestId('pagination');
    const prevButton = screen.getByText(/Prev/);
    const nextButton = screen.getByText(/Next/);
    expect(prevButton).toHaveAttribute('aria-disabled', 'false');
    expect(nextButton).toHaveAttribute('aria-disabled', 'false');
  });
});
