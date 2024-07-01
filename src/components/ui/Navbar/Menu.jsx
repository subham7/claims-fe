/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import classes from "./Navbar.module.scss";
import { GoPlus } from "react-icons/go";
import { useRouter } from "next/router";

const Menu = ({
  spaces,
  showMenu,
  setShowMenu,
  dropdownRef,
  setShowCreateSpaceModal,
}) => {
  const router = useRouter();
  return (
    <div
      className={classes.menu}
      onClick={() => {
        setShowMenu(true);
      }}
      ref={dropdownRef}>
      <Image src="/assets/icons/menu.svg" alt="spaces" height={20} width={20} />
      {showMenu && (
        <div className={classes.menuOptions}>
          <div className={classes.header}>
            <p
              style={{
                color: "#707070",
                fontSize: "1.2rem",
                fontWeight: "500",
              }}>
              SPACES
            </p>
            <p
              style={{
                fontSize: "0.7rem",
              }}>
              BETA
            </p>
          </div>
          <div className={classes.spaces}>
            {spaces.length > 0 ? (
              spaces.map((space, index) => (
                <button
                  key={index}
                  className={classes.space}
                  onClick={() => {
                    setShowMenu(false);
                    router.push(`/space/${space.spaceId}`);
                  }}>
                  <img
                    src={
                      space.logo ? space.logo : "/assets/images/spaceLogo.png"
                    }
                    alt={spaces.name}
                    height={50}
                    width={50}
                    className={classes.spaceImage}
                  />
                  <p
                    style={{
                      color: "#fff",
                      fontSize: "1rem",
                    }}>
                    {space.name}
                  </p>
                </button>
              ))
            ) : (
              <div className={classes.defaultStations}>
                <img
                  src="/assets/icons/verified_icon.svg"
                  alt="verified"
                  style={{
                    width: "30px",
                    height: "30px",
                  }}
                />
                <p
                  style={{
                    color: "#707070",
                  }}>
                  Show your stations to the world. <br /> Add one to get
                  started.
                </p>
              </div>
            )}
          </div>
          <button
            className={classes.createSpace}
            onClick={() => {
              setShowMenu(false);
              setShowCreateSpaceModal(true);
            }}>
            <GoPlus size={22} /> Add a space
          </button>
        </div>
      )}
    </div>
  );
};

export default Menu;
