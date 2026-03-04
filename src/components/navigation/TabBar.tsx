import React, { useState, useEffect } from "react";
import { IonIcon } from "@ionic/react";
import {
  homeOutline,
  heartOutline,
  personOutline,
  informationOutline,
  personSharp,
  personCircleSharp,
  homeSharp,
  informationSharp,
  informationCircleSharp,
} from "ionicons/icons";
import { NavLink, useLocation } from "react-router-dom";
import { IonStorageContext } from "../../contexts/StorageContext";

const TabBar: React.FC = () => {
  const location = useLocation();
  const [hidden, setHidden] = useState(false);
  const [prevScroll, setPrevScroll] = useState(0);
  const { isGuest } = React?.useContext(IonStorageContext);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;

      if (currentScroll > prevScroll && currentScroll > 50) {
        setHidden(true); // scrolling down
      } else {
        setHidden(false); // scrolling up
      }

      setPrevScroll(currentScroll);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScroll]);

  const items = [
    { to: "/home", label: "Home", icon: homeSharp, isGuest: null },
    {
      to: "/favorites",
      label: "Favorites",
      icon: heartOutline,
      isGuest: false,
    },
    { to: "/profile", label: "Profile", icon: personOutline, isGuest: false },
    { to: "/info", label: "Info", icon: informationCircleSharp, isGuest: true },
  ];

  return (
    <nav
      className={`fixed left-0 right-0 bottom-4 z-50 flex justify-center pointer-events-none transition-all duration-300 ${
        hidden ? "-translate-y-24 opacity-0" : "translate-y-0 opacity-100"
      }`}
    >
      {/* w-[90%] */}
      <div className="w-[65%] max-w-3xl bg-gray-900/95 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-700 p-2 flex justify-between items-center gap-2 pointer-events-auto">
        {items
          .filter((x: any, idx: number) => {
            if (isGuest === false && idx < 3) {
              return x;
            }

            if (
              isGuest === true &&
              (x["isGuest"] === true || x["isGuest"] === null)
            ) {
              return x;
            }
          })
          .map((it, idx) => {
            const selected = location.pathname === it.to;

            return (
              <NavLink
                key={it.to}
                to={it.to} // removed from the class: py-2 px-2 gap-1 flex-col
                className={`flex-1 flex flex-row p-2 items-center justify-center rounded-2xl transition-all duration-150 ${
                  selected
                    ? "!bg-amber-400/90 shadow-[0_0_10px_rgba(255,250,221,0.4)]"
                    : "hover:bg-gray-700 hover:shadow-[0_0_8px_rgba(255,255,255,0.4)]"
                }`}
              >
                <div
                  className={`rounded-full py-1 flex items-center justify-center transition-transform duration-150 ${
                    selected ? "text-white" : "text-white/50"
                  }`}
                >
                  {/*  */}
                  <IonIcon
                    icon={it.icon}
                    className="mr-1"
                    style={{ fontSize: "20px" }}
                  />
                </div>
                <span
                  className={`text-[15px] font-bold ${
                    selected ? "text-white" : "text-white/50"
                  }`}
                >
                  {it.label}
                </span>
              </NavLink>
            );
          })}
      </div>
    </nav>
  );
};

export default TabBar;
