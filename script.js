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

// Hesap hareketlerini listelediğimiz fonksiyon
const displayMovements = function (acc, sort = false) {
  // html içindeki değerleri temizliyoruz
  containerMovements.innerHTML = '';

  // ascending sıralama için sort metodunu kullanıyoruz
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  // foreach döngüsü ile hareketlerini listeliyoruz
  movs.forEach(function (mov, i) {
    // hareketin türüne göre text yazdırıyoruz
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementsDates(date, acc.locale);
    const formattedMov = formatCur(mov, acc.locale, acc.currency);

    // döngüde her satıra eklenecek html değerleri tanımlıyoruz
    const html = `
<div class="movements__row">
<div class="movements__type movements__type--${type}"> ${i + 1} ${type} </div>
<div class="movements__date">${displayDate}</div>
<div class="movements__value">  ${formattedMov} </div>
</div>`;
    // html değerleri ilgili query alınan gönderiyoruz
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// Hesapta bulunan miktarı listelemek için fonksiyonu kullanıyoruz
const calcDisplayBalance = function (acc) {
  // balance hesaplamasını yapıyoruz
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  // balance değerini tanımlandığımız label alanına yazdırıyoruz
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

// Hesap özetlerini listeleyen fonksiyon
const calcDisplaySummary = function (acc) {
  // Hesaba gelen miktarları hesaplıyoruz
  const incomes = acc.movements
    // önce sıfırdan büyük olan miktarları filtreliyoruz
    .filter(mov => mov > 0)
    // filtrelenen miktarların toplamını buluyoruz
    .reduce((acc, mov) => acc + mov, 0);
  // toplam miktarı ilgili label alanına yazdırıyoruz
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  // Hesaptan çıkan miktarı hesaplıyoruz
  const outgoing = acc.movements
    /// sıfırdan küçük olan miktarları filtreliyoruz
    .filter(mov => mov < 0)
    // filtrelenen miktarları toplamını buluyoruz.
    .reduce((acc, mov) => acc + mov, 0);
  // bulunan miktarı ilgili label alanına yazdırıyoruz
  labelSumOut.textContent = formatCur(
    Math.abs(outgoing),
    acc.locale,
    acc.currency
  );

  // Hesaba tanımlanan faizi hesaplıyoruz.
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  // tofixed metodu ile kaç küsürat basamağı göstereceğini belirtiyoruz.
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

// Kullanıcı adı oluşturan fonksiyon
const createUsernames = function (accs) {
  // array ile gelen hesap bilgilerini foreach ile dönüyoruz
  accs.forEach(function (acc) {
    acc.username = acc.owner
      // owner verisini tüm harfleri küçültme işlemi
      .toLowerCase()
      // boşluklardan ayırıyoruz
      .split(' ')
      // map ile ayrılan objelerin birinci elementlerini seçiyoruz
      .map(name => name[0])
      // join ile seçilen elemenleri birleştiriyoruz
      .join('');
  });
};
// fonksiyona ilgili array dizisini gönderiyoruz
createUsernames(accounts);

// hesap arayüzünü günceleyen fonksiyon
const updateUI = function (acc) {
  // Hesap hareketleri fonksiyonuna giriş yapan hesabın array dizisini gönderiyoruz
  displayMovements(acc);

  // Hesap toplam miktarı gösteren fonksiyona giriş yapan hesap bilgisini gönderiyoruz
  calcDisplayBalance(acc);

  // Hesap özetleri fonksiyonuna giriş yapan hesap bilgisini gönderiyoruz
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
      // Arayüz opasitesi değiştirilerek görünür oluyor
      containerApp.style.opacity = 0;
    }
    // decrese 1s
    time--;
  };

  // set time to 5 minutes
  let time = 120;

  // call the timer every second
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

// Giriş yapan hesap ve zaman sayacı değişkeni
let currenAccount, timer;

// currenAccount = account1;
// updateUI(currenAccount);
// containerApp.style.opacity = 100;

// Hesap giriş eventi
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  // giriş yapan username ve pin kodunu kontrol ediyoruz
  currenAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  if (currenAccount?.pin === Number(inputLoginPin.value)) {
    // sonuç true wellcome mesajı ve hesabın adı yazdırılıyor
    labelWelcome.textContent = `Wellcome back, ${
      currenAccount.owner.split(' ')[0]
    }`;
    // Arayüz opasitesi değiştirilerek görünür oluyor
    containerApp.style.opacity = 100;

    // Bugünün tarihini ekrana yazdırıyoruz
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

    // Ansayfadaki kullanıcı adı bilgilerini gizliyoruz.
    const hideUnames = document.querySelector('.uname');
    hideUnames.style.display = 'none';

    // giriş yapınca zaman sayacı çalıştıracak fonksiyon
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    // update ui fonksiyonunu giriş yapan hesap bilgisi gönderiliyor
    updateUI(currenAccount);
  } else {
    // şifre veya kullanıcı adı hatalı ise
    alert('Wrong Password or Username');
  }
});

/// Para transferi için event fonksiyonu tanımlıyoruz
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  // Girilen değer için değişken tanımlıyoruz
  const amount = Number(inputTransferAmount.value);

  // Alıcı hesap için değişken tanımlıyoruz
  const receiverAcc = accounts.find(
    // alıcının kullanıcı adını kontrol ediyoruz
    acc => acc.username === inputTransferTo.value
  );

  // işlem sonrası input alanlarındaki yazıları temizliyoruz
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    // miktar sıfırdan büyük olmalı
    amount > 0 &&
    // kullanıcı adı gerçek olmalı
    receiverAcc &&
    // mevcut hesap bakiyesi yeterli olmalı
    currenAccount.balance >= amount &&
    // alıcı hesap adı gönderen hesaptan farklı olmalı
    receiverAcc.username !== currenAccount.username
  ) {
    // gönderen hesaptan girilen miktar düşüyoruz
    currenAccount.movements.push(-amount);

    // alıcı hesaba girilen miktarı push ediyoruz
    receiverAcc.movements.push(amount);

    // Para transafer tarihini getiriyoruz.
    currenAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // İşlemin arayüzde görünür olmasını sağlayan fonksiyonu çalıştırıyoruz.
    updateUI(currenAccount);

    // Transfer işlemi yaparsak zaman sayacını yeniden başlatıyoruz
    clearInterval(timer); // sayacı durdur
    timer = startLogOutTimer(); // sayacı yeniden başlat
  }
});

// kredi talebi alanı için eventi tanımlıyoruz
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  // talep edilen miktar için değişkenimizi tanımlıyoruz.
  const amount = Math.floor(inputLoanAmount.value);
  // İlgili koşulları tanımlıyoruz.
  // some metoduyla talep edilen miktar, mevcut hesaptaki en büyük miktarın maksimum 10 katı kadar olabilir
  if (amount > 0 && currenAccount.movements.some(mov => mov >= amount / 10)) {
    setTimeout(function () {
      // Add movement
      currenAccount.movements.push(amount);

      // Kredi talebi tarihini getiriyoruz.
      currenAccount.movementsDates.push(new Date().toISOString());

      // update UI
      updateUI(currenAccount);

      // Loan işlemi yaparsak zaman sayacını yeniden başlatıyoruz
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 2500);
  } else {
    alert(
      'bu miktar için hesabınız müsait değil. lütfen daha küçük bir miktar deneyin'
    );
  }
  inputLoanAmount.value = '';
});

// Hesabı silme eventi
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  // input alanınan girilen verileri mevcut değerler ile karşılaştırıyoruz
  if (
    inputCloseUsername.value === currenAccount.username &&
    Number(inputClosePin.value) === currenAccount.pin
  ) {
    //input alanına girilen bilgileri findindex metoduyla kullanıcı hesabı ile eşleştiriyoruz
    const index = accounts.findIndex(
      acc => acc.username === currenAccount.username
    );

    // Splice methoduyla hesabı siliyoruz
    accounts.splice(index, 1);

    // İşlem sonrasında arayüzü gizliyoruz.
    containerApp.style.opacity = 0;
  }
  // işlem sonrası input alanlarındaki yazıları temizliyoruz
  inputCloseUsername.value = inputClosePin.value = '';
  // İşlem sonrası wellcome mesajını güncelliyoruz
  labelWelcome.textContent = 'Log in to get started';
});

// Hesap hareketlerini sıralama değişkeni
let sorted = false;

// Hesap hareketlerini sıralama eventi
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  // Sort butonu tıklandığında true olarak parametre gönderiyoruz
  displayMovements(currenAccount, !sorted);
  // Butona tekrar tıklandığında tekrar false değeri almasını sağlıyoruz
  sorted = !sorted;
});
