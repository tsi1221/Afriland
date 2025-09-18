import SellerDashboard from "./views/SellerDashboard";
import AddLand from "./views/AddLand";
import ApproveRequest from "./views/ApproveRequest";
import SellerProfile from "./views/sellerProfile";
import ViewImage from "./views/viewImage";
import UpdateSeller from "./views/updateSeller";
import Help from "./Help";

var routes = [
  {
    path: "/SellerDashboard",
    name: "Dashboard",
    rtlName: "لوحة القيادة",
    icon: "tim-icons icon-chart-pie-36",
    element: <SellerDashboard />,
    layout: "/Seller",
  },
  {
    path: "/AddLand",
    name: "Add Land",
    rtlName: "الرموز",
    icon: "tim-icons icon-world",
    element: <AddLand />,
    layout: "/Seller",
  },
  {
    path: "/sellerProfile",
    name: "Seller Profile",
    rtlName: "الرموز",
    icon: "tim-icons icon-single-02",
    element: <SellerProfile />,
    layout: "/Seller",
  },
  {
    path: "/ApproveRequest",
    name: "Land Requests",
    rtlName: "الرموز",
    icon: "tim-icons icon-badge",
    element: <ApproveRequest />,
    layout: "/Seller",
  },
  {
    path: "/viewImage",
    name: "Land Gallery",
    rtlName: "الرموز",
    icon: "tim-icons icon-image-02",
    element: <ViewImage />,
    layout: "/Seller",
  },
  {
    path: "/Help",
    name: "Help",
    rtlName: "الرموز",
    icon: "tim-icons icon-image-02",
    element: <Help />,
    layout: "/Seller",
  },
  {
    path: "/updateSeller",
    name: "",
    rtlName: "الرموز",
    icon: "tim-icons",
    element: <UpdateSeller />,
    layout: "/Seller",
  },
];

export default routes;
