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

const StationCard = ({ club }) => {
  const { name, totalAmountRaised, membersCount, depositDeadline, imageUrl } =
    club;
  return (
    <div className={classes.stationCard}>
      <div
        style={{
          backgroundImage: imageUrl
            ? imageUrl
            : `url(/assets/images/astronaut3.png)`,
        }}
        className={classes.stnImg}
      />
      <div>
        <div className={classes.stnInfo}>
          <Typography variant="body">{name}</Typography>
          <div>
            <div>Total Raised</div>
            <div>{totalAmountRaised} USDC</div>
          </div>
          <div>
            <div>Last Date</div>
            <div>{depositDeadline}</div>
          </div>
          <div>
            <div>Members</div>
            <div>{membersCount}</div>
          </div>
          <button>Join</button>
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
      const response = await getClubListForWallet(wallet ?? address, chain);
      if (response?.data?.clubs) {
        setClubsData(response.data.clubs);
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      console.error(err);
    }
  };

  const getUserProfileData = async () => {
    try {
      const response = await getUserData(wallet ?? address);
      if (response?.data) {
        setUserData(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (wallet || address) {
      getUserProfileData();
    }
  }, [wallet, address]);

  useEffect(() => {
    if (wallet || address) {
      getClubsData();
    }
  }, [wallet, address, chain]);

  return (
    <Layout showSidebar={false}>
      <div className={classes.profileDiv}>
        <div>
          <div
            style={{
              backgroundImage: userData.imgUrl
                ? userData.imgUrl
                : `url(/assets/images/astronaut3.png)`,
            }}
            className={classes.img}
          />
          <div>
            <Typography variant="subheading">{userData?.userName}</Typography>
            <Typography variant="body">{userData?.bio}</Typography>
            <Typography variant="body">
              {userData?.socialLinks?.website}
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
          <SocialButtons data={userData?.socialLinks} />
        </div>
      </div>

      <div className={classes.selectMenu}>
        <Select
          value={chain}
          label="network"
          onChange={(e) => setSelectedChain(e.target.value)}>
          <MenuItem value={"0x89"}>Polygon</MenuItem>
          <MenuItem value={"0x2105"}>Base</MenuItem>
          <MenuItem value={"0x82750"}>Scroll</MenuItem>
          <MenuItem value={"0x1"}>Ethereum</MenuItem>
          <MenuItem value={"0x5"}>Goerli</MenuItem>
        </Select>
      </div>
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

      <EditProfileDetails
        open={openEditModal}
        wallet={wallet ?? address}
        onClose={() => setOpenEditModal(false)}
      />
    </Layout>
  );
};

export default ProfilePage;
