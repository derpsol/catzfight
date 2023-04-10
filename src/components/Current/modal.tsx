import { Box, Button, Skeleton } from "@mui/material";
import Modal from "@mui/material/Modal";
import { style, modalAvatarStyle } from "components/Current/style";

interface ISampleModal {
  openState: boolean;
  setOpenState: Function;
  nftids: any[];
  nfturis: any[];
  isLoading: boolean;
  allowFlg: boolean[];
  onEnterRoom: Function;
  approve: Function;
}

export function SampleModal({
  openState,
  setOpenState,
  nftids,
  nfturis,
  isLoading,
  allowFlg,
  onEnterRoom,
  approve,
}: ISampleModal) {
  return (
    <Modal
      open={openState}
      onClose={() => {
        setOpenState(false);
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        {nftids &&
          nftids.map((id: Number, index) => {
            return (
              <Box
                sx={{ m: 2, display: "flex", flexDirection: "column" }}
                key={index}
              >
                <Box sx={{ mb: 2, display: "flex", flexDirection: "column" }}>
                  {nfturis ? (
                    <Box
                      component="img"
                      src={nfturis?.[index]}
                      alt="NFT_avatar"
                      sx={modalAvatarStyle}
                    />
                  ) : (
                    <Skeleton sx={modalAvatarStyle} />
                  )}
                </Box>
                {isLoading ? (
                  <Skeleton height="36px" />
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={
                      allowFlg?.[index]
                        ? () => {
                            onEnterRoom(index);
                            setOpenState(false);
                          }
                        : () => approve(id)
                    }
                  >
                    {allowFlg?.[index] ? "Fight" : "Approve"}
                  </Button>
                )}
              </Box>
            );
          })}
      </Box>
    </Modal>
  );
}

interface IBigRoomModal {
  claimState: boolean;
  setClaimState: Function;
	setWhichfight: Function;
  nftids: any[];
  nfturis: any[];
  isLoading: boolean;
  allowFlg: boolean[];
  onClaimFight: Function;
  approve: Function;
}

export function BigRoomModal({claimState, setClaimState, setWhichfight, nftids, nfturis, isLoading, allowFlg, approve, onClaimFight}: IBigRoomModal) {
  return (
    <Modal
      open={claimState}
      onClose={() => {
        setClaimState(false);
        setWhichfight(0);
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        {nftids &&
          nftids.map((id: Number, index) => {
            return (
              <Box
                sx={{ m: 2, display: "flex", flexDirection: "column" }}
                key={index}
              >
                <Box sx={{ mb: 2, display: "flex", flexDirection: "column" }}>
                  {nfturis ? (
                    <Box
                      component="img"
                      src={nfturis?.[index]}
                      alt="NFT_avatar"
                      sx={modalAvatarStyle}
                    />
                  ) : (
                    <Skeleton sx={modalAvatarStyle} />
                  )}
                </Box>
                {isLoading ? (
                  <Skeleton height="36px" />
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={
                      allowFlg?.[index]
                        ? () => {
                            onClaimFight(index);
                            setClaimState(false);
                          }
                        : () => approve(id)
                    }
                  >
                    {allowFlg?.[index] ? "Fight" : "Approve"}
                  </Button>
                )}
              </Box>
            );
          })}
      </Box>
    </Modal>
  );
}
