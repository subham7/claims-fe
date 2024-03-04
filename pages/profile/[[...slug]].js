import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "@components/layouts/layout";
import classes from "./profile.module.scss";
import Typography from "@components/ui/Typography/Typography";
import SocialButtons from "@components/common/SocialButtons";
import EditIcon from "@mui/icons-material/Edit";
import { useAccount } from "wagmi";
import { getClubListForWallet, getUserData } from "api/club";
import EditProfileDetails from "@components/settingsComps/modals/EditProfileDetails";
import { CircularProgress, MenuItem, Select } from "@mui/material";
import { CHAIN_CONFIG } from "utils/constants";
import { RiLinkM } from "react-icons/ri";
import Image from "next/image";
// import { getUploadedNFT } from "api/assets";
// import { getImageURL } from "utils/globalFunctions";

const StationCard = ({ club }) => {
  const {
    name,
    totalAmountRaised,
    membersCount,
    depositDeadline,
    imageUrl,
    isNative,
    isActive,
    networkId,
    daoAddress,
  } = club;

  return (
    <div className={classes.stationCard}>
      <div className="flex justify-between items-center">
        {/* <div
          style={{
            backgroundImage: imageUrl
              ? `url(${imageUrl})`
              : `/assets/images/fallbackDao.png`,
          }}
          className={classes.stnImg}
        /> */}
        <Image
          src={"/assets/images/fallbackDao.png"}
          height={60}
          width={60}
          alt="Fallback Image"
          className="rounded-full"
        />
        <div
          className={`${
            isActive ? "bg-green-600" : "bg-red-600"
          } rounded-lg text-xs text-white px-2 py-1`}>
          {isActive ? "Active" : "Inactive"}
        </div>
      </div>
      <div>
        <div className={classes.stnInfo}>
          <Typography className={"truncate h-6 w-full"} variant="body">
            {name}
          </Typography>
          <div className="flex items-center">
            <div>Total Raised</div>
            <div>{Number(totalAmountRaised).toFixed(4)} USDC</div>
          </div>
          <div>
            <div>Last Date</div>
            <div>{depositDeadline}</div>
          </div>
          <div>
            <div>Members</div>
            <div>{membersCount}</div>
          </div>
          <div className="flex items-center gap-2">
            <div>Deposit token</div>
            <div>
              {isNative
                ? "USDC"
                : CHAIN_CONFIG[networkId]?.nativeCurrency?.symbol}
            </div>
          </div>
          <button
            onClick={() => {
              window.open(`/join/${daoAddress}/${networkId}`, "_blank");
            }}>
            Join
          </button>
        </div>
      </div>
    </div>
  );
};

const ProfilePage = () => {
  const router = useRouter();
  const [openEditModal, setOpenEditModal] = useState(false);

  const [wallet] = router?.query?.slug ?? [];
  const { address } = useAccount();
  const [clubsData, setClubsData] = useState([]);
  const [userData, setUserData] = useState({});
  const [chain, setSelectedChain] = useState("0x89");
  const [loading, setLoading] = useState(false);

  const getClubsData = async () => {
    try {
      setLoading(true);
      const response = await getClubListForWallet(wallet, chain);
      if (response?.data?.clubs) {
        // const clubData = [];
        // const promises = await response.data.clubs.map(async (club) => {
        //   const promise = new Promise(async (resolve) => {
        //     try {
        //       const imageUrl = await getUploadedNFT(
        //         club.daoAddress?.toLowerCase(),
        //       );
        //       if (imageUrl?.data.length) {
        //         club.imageUrl = imageUrl?.data[0]?.imageUrl ?? "";
        //       } else {
        //         const imageUrl = await getImageURL(club?.imageUrl);
        //         club.imageUrl = imageUrl ?? "";
        //       }
        //     } catch (error) {
        //       console.error(error);
        //     } finally {
        //       clubData.push(club);
        //       resolve(true);
        //     }
        //   });
        //   return promise;
        // });
        // await Promise.all(promises);
        setClubsData(response?.data?.clubs);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getUserProfileData = async () => {
    try {
      const response = await getUserData(wallet);
      if (response?.data) {
        setUserData(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (wallet) {
      getUserProfileData();
    }
  }, [wallet]);

  useEffect(() => {
    if (wallet) {
      getClubsData();
    }
  }, [wallet, chain]);

  if (!wallet) {
    return;
  }

  return (
    <Layout showSidebar={false}>
      <div className={classes.profileDiv}>
        <div>
          <div
            style={{
              backgroundImage: userData?.imgUrl
                ? `url(${userData.imgUrl})`
                : `url(/assets/images/astronaut3.png)`,
            }}
            className={classes.img}
          />
          <div>
            <Typography variant="subheading">{userData?.userName}</Typography>
            <Typography variant="body">{userData?.bio}</Typography>
            <Typography className={"flex items-center gap-2"} variant="body">
              {userData?.socialLinks?.website && (
                <RiLinkM className="text-gray-500" />
              )}
              <div
                onClick={() =>
                  window.open(userData?.socialLinks?.website, "_blank")
                }
                className="text-blue-500 h-6 w-72 cursor-pointer truncate hover:underline">
                {userData?.socialLinks?.website}
              </div>
            </Typography>
          </div>
        </div>
        <div>
          <div>
            <EditIcon
              onClick={() => setOpenEditModal(true)}
              className={classes.editIcon}
              size={20}
            />
          </div>
          <SocialButtons
            data={userData}
            shareLink={address ? `/profile/${address}` : ""}
          />
        </div>
      </div>
      <Select value={chain} onChange={(e) => setSelectedChain(e.target.value)}>
        <MenuItem value={"0x89"}>Polygon</MenuItem>
        <MenuItem value={"0x2105"}>Base</MenuItem>
        <MenuItem value={"0x82750"}>Scroll</MenuItem>
        <MenuItem value={"0x1"}>Ethereum</MenuItem>
        <MenuItem value={"0x5"}>Goerli</MenuItem>
      </Select>
      {loading ? (
        <div className={classes.loaderContainer}>
          <CircularProgress />
        </div>
      ) : (
        <div className={classes.stnList}>
          {clubsData?.map((club, index) => (
            <StationCard club={club} key={index} />
          ))}
        </div>
      )}

      {clubsData.length == 0 && !loading && (
        <div className={classes.loaderContainer}>
          <p>No clubs to show</p>
        </div>
      )}

      {openEditModal ? (
        <EditProfileDetails
          open={openEditModal}
          wallet={address}
          onClose={() => setOpenEditModal(false)}
          userData={userData}
          getUserProfileData={getUserProfileData}
        />
      ) : null}
    </Layout>
  );
};

export default ProfilePage;
