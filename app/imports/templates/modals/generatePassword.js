import bids from '/imports/lib/bids';

Template['modals_generatePassword'].helpers({
  password() {
    // The password is generated at startup.js
    return bids.getPassword();
  }
})