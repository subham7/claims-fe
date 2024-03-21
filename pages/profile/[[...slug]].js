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
    clubSocials,
  } = club;

  return (
    <div className={classes.stationCard}>
      <div className={classes.stnHeader}>
        <Image
          src={clubSocials?.logoUrl ?? "/assets/images/fallbackDao.png"}
          height={60}
          width={60}
          alt="Fallback Image"
          style={{
            borderRadius: "12px",
          }}
        />
        <div className={isActive ? classes.active : classes.inactive}>
          {isActive ? "Active" : "Inactive"}
        </div>
      </div>
      <div>
        <div className={classes.stnInfo}>
          <div className={classes.stnName}>{name}</div>
          <div>
            <div>Total Raised</div>
            <div>
              {Number(totalAmountRaised ?? 0).toFixed(4)}{" "}
              {isNative
                ? "USDC"
                : CHAIN_CONFIG[networkId]?.nativeCurrency?.symbol}
            </div>
          </div>
          <div>
            <div>Last Date</div>
            <div>{depositDeadline}</div>
          </div>
          <div>
            <div>Members</div>
            <div>{membersCount}</div>
          </div>
          <div>
            <div>Deposit token</div>
            <div>
              {isNative
                ? "USDC"
                : CHAIN_CONFIG[networkId]?.nativeCurrency?.symbol}
            </div>
          </div>
          <button
            className={classes.joinBtn}
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
      <div className={classes.profileContainer}>
        <div className={classes.profileDiv}>
          <div>
            <div
              style={{
                backgroundImage: userData?.imgUrl
                  ? `url(${userData.imgUrl})`
                  : `url(/assets/images/fallbackDao.png)`,
              }}
              className={classes.img}
            />
            <div>
              <Typography className={classes.truncateInfo} variant="subheading">
                {userData?.userName ?? wallet}
              </Typography>
              <Typography className={classes.truncateInfo} variant="body">
                {userData?.bio}
              </Typography>
              <Typography className={classes.linkDiv} variant="body">
                {userData?.socialLinks?.website && <RiLinkM />}
                <div
                  onClick={() =>
                    window.open(userData?.socialLinks?.website, "_blank")
                  }
                  className={classes.link}>
                  {userData?.socialLinks?.website}
                </div>
              </Typography>
            </div>
          </div>
          <div>
            {wallet === address ? (
              <EditIcon
                onClick={() => setOpenEditModal(true)}
                className={classes.editIcon}
                size={20}
              />
            ) : null}
            <SocialButtons
              data={userData}
              shareLink={address ? `/profile/${address}` : ""}
            />
          </div>
        </div>
        <Select
          value={chain}
          onChange={(e) => setSelectedChain(e.target.value)}>
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
      </div>
    </Layout>
  );
};

export default ProfilePage;