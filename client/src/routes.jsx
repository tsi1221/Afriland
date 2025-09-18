import BuyerProfile from "./views/buyerProfile";
import Dashboard from "./views/Dashboard";
import ViewImage from "./views/viewImage";
import OwnedLands from "./views/OwnedLands";
import MakePayment from "./views/MakePayment";
import UpdateBuyer from "./views/updateBuyer";
import Help from "./Help";

var routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    rtlName: "لوحة القيادة",
    icon: "tim-icons icon-chart-pie-36",
    element: <Dashboard />,
    layout: "/admin",
  },
  {
    path: "/buyerProfile",
    name: "Buyers Profile",
    rtlName: "الرموز",
    icon: "tim-icons icon-single-02",
    element: <BuyerProfile />,
    layout: "/admin",
  },
  {
    path: "/viewImage",
    name: "Land Gallery",
    rtlName: "الرموز",
    icon: "tim-icons icon-image-02",
    element: <ViewImage />,
    layout: "/admin",
  },
  {
    path: "/OwnedLands",
    name: "Owned Lands",
    rtlName: "الرموز",
    icon: "tim-icons icon-bank",
    element: <OwnedLands />,
    layout: "/admin",
  },
  {
    path: "/MakePayment",
    name: "Make Payment",
    rtlName: "الرموز",
    icon: "tim-icons icon-money-coins",
    element: <MakePayment />,
    layout: "/admin",
  },
  {
    path: "/Help",
    name: "Help",
    rtlName: "الرموز",
    icon: "tim-icons icon-single-02",
    element: <Help />,
    layout: "/admin",
  },
  {
    path: "/updateBuyer",
    name: "",
    rtlName: "الرموز",
    icon: "tim-icons",
    element: <UpdateBuyer />,
    layout: "/admin",
  },
];

export default routes;
