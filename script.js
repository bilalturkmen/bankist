'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2022-07-01T23:36:17.929Z',
    '2022-07-03T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'de-DE',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//////

const formatMovementsDates = function (date, locale) {
  const calcDisplayDate = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDisplayDate(new Date(), date);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    // const day = `${date.getDate()}`.padStart(2, 0);
    // const month = `${date.getMonth() + 1}`.padStart(2, 0);
    // const year = date.getFullYear();
    // return `${day}/${month}/${year}`;

    return new Intl.DateTimeFormat(locale).format(date);
  }
};

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

// Hesap hareketlerini listeledi??imiz fonksiyon
const displayMovements = function (acc, sort = false) {
  // html i??indeki de??erleri temizliyoruz
  containerMovements.innerHTML = '';

  // ascending s??ralama i??in sort metodunu kullan??yoruz
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  // foreach d??ng??s?? ile hareketlerini listeliyoruz
  movs.forEach(function (mov, i) {
    // hareketin t??r??ne g??re text yazd??r??yoruz
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementsDates(date, acc.locale);
    const formattedMov = formatCur(mov, acc.locale, acc.currency);

    // d??ng??de her sat??ra eklenecek html de??erleri tan??ml??yoruz
    const html = `
<div class="movements__row">
<div class="movements__type movements__type--${type}"> ${i + 1} ${type} </div>
<div class="movements__date">${displayDate}</div>
<div class="movements__value">  ${formattedMov} </div>
</div>`;
    // html de??erleri ilgili query al??nan g??nderiyoruz
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// Hesapta bulunan miktar?? listelemek i??in fonksiyonu kullan??yoruz
const calcDisplayBalance = function (acc) {
  // balance hesaplamas??n?? yap??yoruz
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  // balance de??erini tan??mland??????m??z label alan??na yazd??r??yoruz
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

// Hesap ??zetlerini listeleyen fonksiyon
const calcDisplaySummary = function (acc) {
  // Hesaba gelen miktarlar?? hesapl??yoruz
  const incomes = acc.movements
    // ??nce s??f??rdan b??y??k olan miktarlar?? filtreliyoruz
    .filter(mov => mov > 0)
    // filtrelenen miktarlar??n toplam??n?? buluyoruz
    .reduce((acc, mov) => acc + mov, 0);
  // toplam miktar?? ilgili label alan??na yazd??r??yoruz
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  // Hesaptan ????kan miktar?? hesapl??yoruz
  const outgoing = acc.movements
    /// s??f??rdan k??????k olan miktarlar?? filtreliyoruz
    .filter(mov => mov < 0)
    // filtrelenen miktarlar?? toplam??n?? buluyoruz.
    .reduce((acc, mov) => acc + mov, 0);
  // bulunan miktar?? ilgili label alan??na yazd??r??yoruz
  labelSumOut.textContent = formatCur(
    Math.abs(outgoing),
    acc.locale,
    acc.currency
  );

  // Hesaba tan??mlanan faizi hesapl??yoruz.
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  // tofixed metodu ile ka?? k??s??rat basama???? g??sterece??ini belirtiyoruz.
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

// Kullan??c?? ad?? olu??turan fonksiyon
const createUsernames = function (accs) {
  // array ile gelen hesap bilgilerini foreach ile d??n??yoruz
  accs.forEach(function (acc) {
    acc.username = acc.owner
      // owner verisini t??m harfleri k??????ltme i??lemi
      .toLowerCase()
      // bo??luklardan ay??r??yoruz
      .split(' ')
      // map ile ayr??lan objelerin birinci elementlerini se??iyoruz
      .map(name => name[0])
      // join ile se??ilen elemenleri birle??tiriyoruz
      .join('');
  });
};
// fonksiyona ilgili array dizisini g??nderiyoruz
createUsernames(accounts);

// hesap aray??z??n?? g??nceleyen fonksiyon
const updateUI = function (acc) {
  // Hesap hareketleri fonksiyonuna giri?? yapan hesab??n array dizisini g??nderiyoruz
  displayMovements(acc);

  // Hesap toplam miktar?? g??steren fonksiyona giri?? yapan hesap bilgisini g??nderiyoruz
  calcDisplayBalance(acc);

  // Hesap ??zetleri fonksiyonuna giri?? yapan hesap bilgisini g??nderiyoruz
  calcDisplaySummary(acc);
};

const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    //in each call print the remaining
    labelTimer.textContent = `${min}:${sec} `;

    //whe 0 stop timer and logout
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Login to get started';
      // Aray??z opasitesi de??i??tirilerek g??r??n??r oluyor
      containerApp.style.opacity = 0;
    }
    // decrese 1s
    time--;
  };

  // set time to 5 minutes
  let time = 300;

  // call the timer every second
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

// Giri?? yapan hesap ve zaman sayac?? de??i??keni
let currenAccount, timer;

containerApp.style.display = 'none';

// Hesap giri?? eventi
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  // giri?? yapan username ve pin kodunu kontrol ediyoruz
  currenAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  if (currenAccount?.pin === Number(inputLoginPin.value)) {
    // sonu?? true wellcome mesaj?? ve hesab??n ad?? yazd??r??l??yor
    labelWelcome.textContent = `Wellcome back, ${
      currenAccount.owner.split(' ')[0]
    }`;
    // Aray??z opasitesi de??i??tirilerek g??r??n??r oluyor
    containerApp.style.opacity = 100;
    containerApp.style.display = 'grid';

    // Bug??n??n tarihini ekrana yazd??r??yoruz
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      // weekday: 'long',
    };

    labelDate.textContent = new Intl.DateTimeFormat(
      currenAccount.locale,
      options
    ).format(now);

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Ansayfadaki kullan??c?? ad?? bilgilerini gizliyoruz.
    const hideUnames = document.querySelector('.uname');
    hideUnames.style.display = 'none';

    // giri?? yap??nca zaman sayac?? ??al????t??racak fonksiyon
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    // update ui fonksiyonunu giri?? yapan hesap bilgisi g??nderiliyor
    updateUI(currenAccount);
  } else {
    // ??ifre veya kullan??c?? ad?? hatal?? ise
    alert('Wrong Password or Username');
  }
});

/// Para transferi i??in event fonksiyonu tan??ml??yoruz
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  // Girilen de??er i??in de??i??ken tan??ml??yoruz
  const amount = Number(inputTransferAmount.value);

  // Al??c?? hesap i??in de??i??ken tan??ml??yoruz
  const receiverAcc = accounts.find(
    // al??c??n??n kullan??c?? ad??n?? kontrol ediyoruz
    acc => acc.username === inputTransferTo.value
  );

  // i??lem sonras?? input alanlar??ndaki yaz??lar?? temizliyoruz
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    // miktar s??f??rdan b??y??k olmal??
    amount > 0 &&
    // kullan??c?? ad?? ger??ek olmal??
    receiverAcc &&
    // mevcut hesap bakiyesi yeterli olmal??
    currenAccount.balance >= amount &&
    // al??c?? hesap ad?? g??nderen hesaptan farkl?? olmal??
    receiverAcc.username !== currenAccount.username
  ) {
    // g??nderen hesaptan girilen miktar d??????yoruz
    currenAccount.movements.push(-amount);

    // al??c?? hesaba girilen miktar?? push ediyoruz
    receiverAcc.movements.push(amount);

    // Para transafer tarihini getiriyoruz.
    currenAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // ????lemin aray??zde g??r??n??r olmas??n?? sa??layan fonksiyonu ??al????t??r??yoruz.
    updateUI(currenAccount);

    // Transfer i??lemi yaparsak zaman sayac??n?? yeniden ba??lat??yoruz
    clearInterval(timer); // sayac?? durdur
    timer = startLogOutTimer(); // sayac?? yeniden ba??lat
  }
});

// kredi talebi alan?? i??in eventi tan??ml??yoruz
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  // talep edilen miktar i??in de??i??kenimizi tan??ml??yoruz.
  const amount = Math.floor(inputLoanAmount.value);
  // ??lgili ko??ullar?? tan??ml??yoruz.
  // some metoduyla talep edilen miktar, mevcut hesaptaki en b??y??k miktar??n maksimum 10 kat?? kadar olabilir
  if (amount > 0 && currenAccount.movements.some(mov => mov >= amount / 10)) {
    setTimeout(function () {
      // Add movement
      currenAccount.movements.push(amount);

      // Kredi talebi tarihini getiriyoruz.
      currenAccount.movementsDates.push(new Date().toISOString());

      // update UI
      updateUI(currenAccount);

      // Loan i??lemi yaparsak zaman sayac??n?? yeniden ba??lat??yoruz
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 2500);
  } else {
    alert(
      'bu miktar i??in hesab??n??z m??sait de??il. l??tfen daha k??????k bir miktar deneyin'
    );
  }
  inputLoanAmount.value = '';
});

// Hesab?? silme eventi
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  // input alan??nan girilen verileri mevcut de??erler ile kar????la??t??r??yoruz
  if (
    inputCloseUsername.value === currenAccount.username &&
    Number(inputClosePin.value) === currenAccount.pin
  ) {
    //input alan??na girilen bilgileri findindex metoduyla kullan??c?? hesab?? ile e??le??tiriyoruz
    const index = accounts.findIndex(
      acc => acc.username === currenAccount.username
    );

    // Splice methoduyla hesab?? siliyoruz
    accounts.splice(index, 1);

    // ????lem sonras??nda aray??z?? gizliyoruz.
    containerApp.style.opacity = 0;
  }
  // i??lem sonras?? input alanlar??ndaki yaz??lar?? temizliyoruz
  inputCloseUsername.value = inputClosePin.value = '';
  // ????lem sonras?? wellcome mesaj??n?? g??ncelliyoruz
  labelWelcome.textContent = 'Log in to get started';
});

// Hesap hareketlerini s??ralama de??i??keni
let sorted = false;

// Hesap hareketlerini s??ralama eventi
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  // Sort butonu t??kland??????nda true olarak parametre g??nderiyoruz
  displayMovements(currenAccount, !sorted);
  // Butona tekrar t??kland??????nda tekrar false de??eri almas??n?? sa??l??yoruz
  sorted = !sorted;
});
