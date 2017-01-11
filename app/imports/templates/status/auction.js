import { registrar } from '/imports/lib/ethereum';
import Helpers from '/imports/lib/helpers/helperFunctions';

function generateSalt() {
  return Math.floor(Math.random() * Math.pow(3500,5)).toString();
}

Template['status-auction'].onCreated(function() {
  TemplateVar.set(this, 'entryData', Template.instance().data.entry);
});

Template['status-auction'].events({
  'click .new-bid'() {
    const bidInput = document.getElementsByName("bidAmount")[0];
    const depositInput = document.getElementsByName("depositAmount")[0];
    const bidAmount = EthTools.toWei(bidInput.value);
    const depositAmount = EthTools.toWei(depositInput.value);
    const name = Session.get('searched');
    const secret = generateSalt();
    const template = Template.instance();
    let accounts = EthAccounts.find().fetch();
    
    if (accounts.length == 0) {
      alert('No accounts added to dapp');
    } else {
      TemplateVar.set(template, 'bidding', true)
      let owner = accounts[0].address;
      let bid = registrar.bidFactory(name, owner, bidAmount, secret);
      console.log('Bid: ', bid);
      registrar.submitBid(bid, {
        value: depositAmount, 
        from: owner,
        gas: 500000
      }, (err, txid) => {
        if (err) {
          TemplateVar.set(template, 'bidding', false)
          alert(err)
          return;
        } 
        console.log(txid)
        Helpers.checkTxSuccess(txid, (err, isSuccessful) => {
          if (err) {
            alert(err)
            TemplateVar.set(template, 'bidding', false)
            return;
          }
          if (isSuccessful) {
            MyBids.insert(
              Object.assign(
                {
                  date: Date.now(),
                  depositAmount,
                  txid
                },
                bid
              )
            );
          } else {
            alert('The transaction failed')
          }
          TemplateVar.set(template, 'bidding', false)
        })
      });
    }
  }
})

Template['status-auction'].helpers({
  registrationDate() {
    var date = new Date(TemplateVar.get('entryData').registrationDate * 1000);
    return date.toLocaleString();
  },
  bidding() {
    return TemplateVar.get('bidding')
  }
})

Template['aside-auction'].helpers({
  bids() {
    const name = Session.get('searched');
    return MyBids.find({name: name});
  }
})
