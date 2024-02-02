import { Box, Flex } from '@chakra-ui/react';
import axios from 'axios';
import { useEffect, useState } from 'react';

import {
  ListingCard,
  ListingsCardSkeleton,
  ListingSection,
} from '@/components/misc/listingsCard';
import { EmptySection } from '@/components/shared/EmptySection';
import type { Bounty } from '@/interface/bounty';
import { Home } from '@/layouts/Home';

interface Listings {
  bounties?: Bounty[];
}

function AllListingsPage() {
  const [isListingsLoading, setIsListingsLoading] = useState(true);
  const [listings, setListings] = useState<Listings>({
    bounties: [],
  });

  const getListings = async () => {
    setIsListingsLoading(true);
    try {
      const listingsData = await axios.get('/api/listings/', {
        params: {
          category: 'bounties',
          take: 100,
        },
      });
      setListings(listingsData.data);
      setIsListingsLoading(false);
    } catch (e) {
      setIsListingsLoading(false);
    }
  };

  useEffect(() => {
    if (!isListingsLoading) return;
    getListings();
  }, []);

  return (
    <Home type="home">
      <Box w={'100%'}>
        <ListingSection
          type="bounties"
          title="Freelance Gigs"
          sub="Bite sized tasks for freelancers"
          emoji="/assets/home/emojis/moneyman.png"
          all
        >
          {isListingsLoading &&
            Array.from({ length: 8 }, (_, index) => (
              <ListingsCardSkeleton key={index} />
            ))}
          {!isListingsLoading && !listings?.bounties?.length && (
            <Flex align="center" justify="center" mt={8}>
              <EmptySection
                title="No listings available!"
                message="Subscribe to notifications to get notified about new bounties."
              />
            </Flex>
          )}
          {!isListingsLoading &&
            listings?.bounties?.map((bounty) => {
              return (
                <ListingCard
                  slug={bounty?.slug}
                  rewardAmount={bounty?.rewardAmount}
                  key={bounty?.id}
                  sponsorName={bounty?.sponsor?.name}
                  deadline={bounty?.deadline}
                  title={bounty?.title}
                  logo={bounty?.sponsor?.logo}
                  token={bounty?.token}
                  type={bounty?.type}
                  applicationType={bounty.applicationType}
                  isWinnersAnnounced={bounty?.isWinnersAnnounced}
                />
              );
            })}
        </ListingSection>
      </Box>
    </Home>
  );
}

export default AllListingsPage;