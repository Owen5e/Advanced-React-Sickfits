import { PAGINATION_QUERY } from '../components/Pagination';

export default function paginationField() {
  return {
    keyArgs: false, // tells apollo we will take care of everything
    read(existing = [], { args, cache }) {
      console.log(existing, args, cache);
      const { skip, first } = args;
      //   1. Read the number of items on the page from the cache
      let data;
      try {
        data = cache.readQuery({ query: PAGINATION_QUERY });
      } catch (e) {
        // Query not in cache yet, go to network
        return undefined;
      }
      if (!data) return undefined;
      const count = data?._allProductsMeta?.count;
      if (!count) return undefined;
      //   2. Calculate what page we are on
      const page = skip / first + 1;
      // 3. Calculate how many pages there are
      const pages = Math.ceil(count / first);
      //   4. Check if we have existing items
      const items = existing.slice(skip, skip + first).filter((x) => x);
      //   If
      // There are items
      // AND
      // There aren't enough items to satisfy how many were requested
      //   AND
      // We are on the last page
      //   Then just send it
      if (items.length && items.length !== first && page === pages) {
        return items;
      }
      if (items.length !== first) {
        //   5. If there are items and there are enough items to satisfy how many were requested
        // Otherwise, we don't have enough items, we must go to the network
        return undefined;
      }
      if (items.length) {
        console.log(
          `There are items in the cache! Gonna return them! ${items.length}`
        );
        return items;
      }
      //   6. Fallback to network
      return undefined;
      // First thing it does is ask the read function for those items
      // We can either do one of two things...
      // 1. Return the items because they are already in the cache
      // 2. Return undefined (network request) to go and fetch them
    },
    merge(existing, incoming, { args }) {
      // This runs when the apollo client comes back from the network with our products
      const { skip, first } = args;
      console.log(`Merging items from the network ${incoming.length}`);
      const merged = existing ? existing.slice(0) : [];
      for (let i = skip; i < skip + incoming.length; ++i) {
        merged[i] = incoming[i - skip];
      }
      //   finally we return the merged items from the cache
      return merged;
    },
  };
}
