import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "@components/layouts/layout";
import classes from "./profile.module.scss";
import Typography from "@components/ui/Typography/Typography";
import SocialButtons from "@components/common/SocialButtons";
import EditIcon from "@mui/icons-material/Edit";
import { useAccount } from "wagmi";
import { getClubListForWallet } from "api/club";
import EditProfileDetails from "@components/settingsComps/modals/EditProfileDetails";

const StationCard = ({ club }) => {
  const { name, totalAmountRaised, membersCount, depositDeadline } = club;
  return (
    <div className={classes.stationCard}>
      <div
        style={{ backgroundImage: `url(/assets/images/astronaut3.png)` }}
        className={classes.stnImg}
      />
      <div>
        <div className={classes.stnInfo}>
          <Typography variant="body">{name}</Typography>
          <div>
            <div>Total Raised</div>
            <div>{totalAmountRaised}</div>
          </div>
          <div>
            <div>Last Date</div>
            <div>{""}</div>
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

  const getClubsData = async () => {
    debugger;
    try {
      const response = await getClubListForWallet(wallet ?? address);
      if (response?.data?.clubs?.length > 0) {
        setClubsData(response.data.clubs);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (wallet || address) {
      getClubsData();
    }
  }, [wallet, address]);

  return (
    <Layout showSidebar={false}>
      <div className={classes.profileDiv}>
        <div>
          <div
            style={{ backgroundImage: `url(/assets/images/astronaut3.png)` }}
            className={classes.img}
          />
          <div>
            <Typography variant="subheading">Bhavya Mehta</Typography>
            <Typography variant="body">
              Investor | Developer | Creator
            </Typography>
            <Typography variant="body">abcd.com</Typography>
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
            data={{
              twitter: "abcd.in",
              discord: "abcd.in",
              telegram: "abcd.in",
            }}
          />
        </div>
      </div>
      <div className={classes.stnList}>
        {clubsData?.map((club, index) => (
          <StationCard club={club} key={index} />
        ))}
      </div>
      <EditProfileDetails
        isClaims={false}
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
      />
    </Layout>
  );
};

export default ProfilePage;
