import { getRandomWords } from './daefen';

export default bids = (function() {
  
  function getPassword() {
    return localStorage.getItem('bidPassword')
  }
  
  return {
    generatePassword() {
      if (getPassword()) {
        throw 'Bid password was already generated.'
      }
      let password = getRandomWords();
      console.log('Password: ', password)
      localStorage.setItem('bidPassword', password);
    },
    getPassword
  }
}());