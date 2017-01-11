Template["components_bidPassword"].events({
  'click .dapp-block-button': function(e) {
    EthElements.Modal.question({
      template: 'modals_generatePassword',
      ok: true
    })
  }
})