import type { FC } from 'react';

import Mint from '@components/Publication/HeyOpenActions/Nft/ZoraNft/Mint';
import { CursorArrowRaysIcon } from '@heroicons/react/24/outline';
import { HEY_API_URL, ZERO_PUBLICATION_ID } from '@hey/data/constants';
import { MISCELLANEOUS, PUBLICATION } from '@hey/data/tracking';
import { Button, Card, Modal } from '@hey/ui';
import getAuthApiHeaders from '@lib/getAuthApiHeaders';
import { Leafwatch } from '@lib/leafwatch';
import axios from 'axios';
import { memo, useState } from 'react';
import toast from 'react-hot-toast';
import useZoraNft from 'src/hooks/zora/useZoraNft';
import { usePreferencesStore } from 'src/store/non-persisted/usePreferencesStore';

const HeyMembershipNft: FC = () => {
  const hasDismissedOrMintedMembershipNft = usePreferencesStore(
    (state) => state.hasDismissedOrMintedMembershipNft
  );
  const setHasDismissedOrMintedMembershipNft = usePreferencesStore(
    (state) => state.setHasDismissedOrMintedMembershipNft
  );
  const [showMintModal, setShowMintModal] = useState(false);

  const { data: nft, loading } = useZoraNft({
    address: '0x8fcfdad5ebdd1ce815aa769bbd7499091ac056d1',
    chain: 'zora'
  });

  if (hasDismissedOrMintedMembershipNft) {
    return null;
  }

  const updateHeyMemberNftStatus = async () => {
    try {
      toast.promise(
        axios.post(`${HEY_API_URL}/preferences/updateNftStatus`, undefined, {
          headers: getAuthApiHeaders()
        }),
        {
          error: 'Error updating.',
          loading: 'Updating...',
          success: () => {
            setHasDismissedOrMintedMembershipNft(true);
            setShowMintModal(false);
            return 'Updated!';
          }
        }
      );
    } catch {}
  };

  return (
    <Card
      as="aside"
      className="text-brand-500 dark:bg-brand-10/50 !border-brand-500 !bg-brand-50 mb-4"
    >
      <img
        alt="Gitcoin emoji"
        className="h-48 w-full rounded-t-xl object-cover"
        src="https://ipfs.decentralized-content.com/ipfs/bafybeib6infyovvtawokys4ejjr4r3qk4soy7jqriejp2wbmttedupsy64"
      />
      <div className="p-5">
        <div className="mb-1 font-bold">
          Hey! Grab your special Hey NFT here.
        </div>
        <div className="text-brand-400 mb-4">
          New or OG, this NFT's for our epic times together. Let's keep the vibe
          alive!
        </div>
        <div className="flex flex-col items-center space-y-1.5">
          <Button
            className="w-full"
            disabled={loading}
            onClick={() => {
              setShowMintModal(true);
              Leafwatch.track(PUBLICATION.OPEN_ACTIONS.ZORA_NFT.OPEN_MINT, {
                from: 'mint_membership_nft'
              });
            }}
          >
            Mint now
          </Button>
          <Modal
            icon={<CursorArrowRaysIcon className="text-brand-500 size-5" />}
            onClose={() => setShowMintModal(false)}
            show={showMintModal}
            title="Mint"
          >
            <Mint
              nft={nft}
              onCompleted={updateHeyMemberNftStatus}
              publicationId={ZERO_PUBLICATION_ID}
              zoraLink="https://zora.co/collect/zora:0x8fcfdad5ebdd1ce815aa769bbd7499091ac056d1"
            />
          </Modal>
          <button
            className="text-sm underline"
            onClick={() => {
              Leafwatch.track(MISCELLANEOUS.DISMISSED_MEMBERSHIP_NFT_BANNER);
              updateHeyMemberNftStatus();
            }}
            type="button"
          >
            Dismiss
          </button>
        </div>
      </div>
    </Card>
  );
};

export default memo(HeyMembershipNft);
