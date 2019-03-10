import { Route, BrowserRouter as Router, Switch } from "react-router-dom";

import AddHoliday from "../components/holidays/add-holiday";
import AdmissionDetails from "../components/resident-details/actions/admission-details";
import AuthWithNav from "../components/shared/AuthWithNav";
import Authenticated from "../components/shared/Authenticated";
import Classes from "../components/classes/class-list";
import DuesCanteen from "../components/residents/dues-canteen";
import DuesMessOne from "../components/residents/dues-mess-one";
import DuesMessTwo from "../components/residents/dues-mess-two";
import DuesRegularPrint from "../components/residents/dues-regular-print";
import DuesRegularResidents from "../components/residents/dues-regular-residents";
import EditClass from "../components/classes/edit-class";
import EditMcBill from "../components/resident-details/accounts/mess-canteen/edit-mc-bill/edit-mc-bill";
import EditMcDayTotal from "../components/mc-collections/edit-mc-day-total";
import EditMcDetail from "../components/mc-collections/edit-mc-detail";
import EditPaBill from "../components/resident-details/accounts/private-account/edit-pa-bill/edit-pa-bill";
import EditPaDayTotal from "../components/pa-collections/edit-pa-day-total";
import EditPaDetail from "../components/pa-collections/edit-pa-detail";
import EditSaDayTotal from "../components/sa-collections/edit-sa-day-total";
import EditSaDetail from "../components/sa-collections/edit-sa-detail";
import EditSession from "../components/sessions/edit-session";
import EffectiveDate from "../components/accounts/effective-date";
import Holidays from "../components/holidays/holidays";
import Home from "../components/single/Home";
import Login from "../components/login/login";
import McCollections from "../components/mc-collections/mc-collections";
import McDateDetails from "../components/mc-collections/mc-date-details";
import McDateDetailsPrint from "../components/mc-collections/mc-date-details-print";
import McMonthCollections from "../components/mc-collections/mc-month-collections";
import McMonthlyPrint from "../components/mc-collections/mc-month-collections-print";
import MesCanFine from "../components/accounts/mes-can-fine";
import { Meteor } from "meteor/meteor";
import NotFound from "../components/shared/NotFound";
import NoticeListPrint from "../components/residents/notice-list-print";
import NoticeListResidents from "../components/residents/notice-list";
import PaCollections from "../components/pa-collections/pa-collections";
import PaDateDetails from "../components/pa-collections/pa-date-details";
import PaDateDetailsPrint from "../components/pa-collections/pa-date-details-print";
import PaMonthCollections from "../components/pa-collections/pa-month-collections";
import PaMonthCollectionsPrint from "../components/pa-collections/pa-month-collections-print";
import PriAccFine from "../components/accounts/pri-acc-fine";
import Profile from "../components/profile/profile";
import PropTypes from "prop-types";
import Public from "../components/shared/Public";
import React from "react";
import Resident from "../components/residents/resident";
import ResidentDetails from "../components/resident-details/resident-details";
import ResidentMcDetails from "../components/mc-collections/resident-mc-details";
import ResidentPaDetails from "../components/pa-collections/resident-pa-details";
import ResidentSaDetails from "../components/sa-collections/resident-sa-details";
import ResidentsAll from "../components/residents/residents-room-wise";
import { Roles } from "meteor/alanning:roles";
import RoomResidents from "../components/residents/room-residents";
import RoomsList from "../components/single/RoomsList";
import SaCollections from "../components/sa-collections/sa-collections";
import SaDateDetails from "../components/sa-collections/sa-date-details";
import SaDateDetailsPrint from "../components/sa-collections/sa-date-details-print";
import SaMonthCollections from "../components/sa-collections/sa-month-collections";
import SaMonthlyPrint from "../components/sa-collections/sa-month-collections-print";
import Sessions from "../components/sessions/sessions-list";
import TransactionDetails from "../components/resident-details/accounts/transaction/transaction-details";
import { withTracker } from "meteor/react-meteor-data";

const App = props => (
  <Router>
    {!props.loading ? (
      <Switch>
        <AuthWithNav exact path="/" component={Home} {...props} />
        <AuthWithNav exact path="/profile" component={Profile} {...props} />
        <AuthWithNav exact path="/admission-details/:resId" component={AdmissionDetails} {...props} />
        <AuthWithNav exact path="/rooms" component={RoomsList} {...props} />
        <AuthWithNav exact path="/sa-collections/:pageNo" component={SaCollections} {...props} />
        <AuthWithNav exact path="/mes-can-fine" component={MesCanFine} {...props} />
        <AuthWithNav exact path="/pri-acc-fine" component={PriAccFine} {...props} />
        <AuthWithNav exact path="/sessions" component={Sessions} {...props} />
        <AuthWithNav exact path="/edit-session/:sessId" component={EditSession} {...props} />
        <AuthWithNav exact path="/holidays" component={Holidays} {...props} />
        <AuthWithNav exact path="/add-holiday" component={AddHoliday} {...props} />
        <AuthWithNav exact path="/residents" component={ResidentsAll} {...props} />
        <AuthWithNav exact path="/room-residents/:roomId" component={RoomResidents} {...props} />
        <AuthWithNav exact path="/resident-details/:resid" component={ResidentDetails} {...props} />
        <AuthWithNav exact path="/dues-regular-residents" component={DuesRegularResidents} {...props} />
        <Authenticated exact path="/dues-mess-one" component={DuesMessOne} {...props} />
        <Authenticated exact path="/dues-mess-two" component={DuesMessTwo} {...props} />
        <Authenticated exact path="/dues-canteen" component={DuesCanteen} {...props} />
        <Authenticated exact path="/dues-regular-print" component={DuesRegularPrint} {...props} />
        <AuthWithNav exact path="/notice-list" component={NoticeListResidents} {...props} />
        <Authenticated exact path="/notice-list-print" component={NoticeListPrint} {...props} />
        <AuthWithNav exact path="/effective-date" component={EffectiveDate} {...props} />
        <AuthWithNav exact path="/edit-mc-bill/:resId/:billId" component={EditMcBill} {...props} />
        <AuthWithNav exact path="/edit-pa-bill/:resId/:billId" component={EditPaBill} {...props} />
        <AuthWithNav exact path="/resident" component={Resident} {...props} />
        <AuthWithNav exact path="/resident/:resId" component={Resident} {...props} />
        <AuthWithNav exact path="/classes" component={Classes} {...props} />
        <AuthWithNav exact path="/edit-class/:classId" component={EditClass} {...props} />
        <AuthWithNav exact path="/sa-date-details/:date" component={SaDateDetails} {...props} />
        <AuthWithNav exact path="/edit-sa-detail/:detId" component={EditSaDetail} {...props} />
        <Authenticated exact path="/sa-date-details-print/:date" component={SaDateDetailsPrint} {...props} />
        <AuthWithNav exact path="/edit-sa-day-total/:detId/:pageNo" component={EditSaDayTotal} {...props} />
        <AuthWithNav exact path="/sa-month-collections/:pageNo" component={SaMonthCollections} {...props} />
        <Authenticated exact path="/sa-month-collections-print/:monthId" component={SaMonthlyPrint} {...props} />
        <AuthWithNav exact path="/resident-sa-details/:resId" component={ResidentSaDetails} {...props} />
        <AuthWithNav exact path="/pa-collections/:pageNo" component={PaCollections} {...props} />
        <AuthWithNav exact path="/pa-date-details/:date" component={PaDateDetails} {...props} />
        <AuthWithNav exact path="/edit-pa-detail/:detId" component={EditPaDetail} {...props} />
        <AuthWithNav exact path="/edit-pa-day-total/:detId/:pageNo" component={EditPaDayTotal} {...props} />
        <Authenticated exact path="/pa-date-details-print/:date" component={PaDateDetailsPrint} {...props} />
        <AuthWithNav exact path="/pa-month-collections/:pageNo" component={PaMonthCollections} {...props} />
        <Authenticated
          exact
          path="/pa-month-collections-print/:monthId"
          component={PaMonthCollectionsPrint}
          {...props}
        />
        <AuthWithNav exact path="/resident-pa-details/:resId" component={ResidentPaDetails} {...props} />
        <AuthWithNav exact path="/mc-collections/:pageNo" component={McCollections} {...props} />
        <AuthWithNav exact path="/mc-date-details/:date" component={McDateDetails} {...props} />
        <AuthWithNav exact path="/edit-mc-detail/:detId" component={EditMcDetail} {...props} />
        <AuthWithNav exact path="/edit-mc-day-total/:detId/:pageNo" component={EditMcDayTotal} {...props} />
        <Authenticated exact path="/mc-date-details-print/:date" component={McDateDetailsPrint} {...props} />
        <AuthWithNav exact path="/mc-month-collections/:pageNo" component={McMonthCollections} {...props} />
        <Authenticated exact path="/mc-month-collections-print/:monthId" component={McMonthlyPrint} {...props} />
        <AuthWithNav exact path="/resident-mc-details/:resId" component={ResidentMcDetails} {...props} />
        <AuthWithNav exact path="/transaction-details/:paDetId/:mcDetId" component={TransactionDetails} {...props} />
        <Public exact path="/login" component={Login} {...props} />
        <Route component={NotFound} />
      </Switch>
    ) : (
      ""
    )}
  </Router>
);

App.defaultProps = {
  userId: "",
  emailAddress: "",
  exact: true
};

App.propTypes = {
  loading: PropTypes.bool.isRequired,
  userId: PropTypes.string,
  emailAddress: PropTypes.string,
  emailVerified: PropTypes.bool.isRequired,
  exact: PropTypes.bool
};

const getUserName = name =>
  ({
    string: name,
    object: `${name.first} ${name.last}`
  }[typeof name]);

export default withTracker(() => {
  const loggingIn = Meteor.loggingIn();
  const user = Meteor.user();
  const userId = Meteor.userId();
  const loading = !Roles.subscription.ready();
  const name = user && user.profile && user.profile.name && getUserName(user.profile.name);
  const emailAddress = user && user.emails && user.emails[0].address;
  return {
    loading,
    loggingIn,
    authenticated: !loggingIn && !!userId,
    name: name || emailAddress,
    roles: !loading && Roles.getRolesForUser(userId),
    userId,
    emailAddress,
    emailVerified: user && user.emails ? user && user.emails && user.emails[0].verified : true
  };
})(App);
