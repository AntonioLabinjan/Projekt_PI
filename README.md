### TODO:
<ol>* popravak CSS-a</ol>
<ol>* sklepat filtriranje "postova" prema current useru (vidi samo ono ča je on stavija)</ol>
USER FILTER
Riješeno:
* exercises
* songs 
* waterIntake
* sleepEntries
* mealTracker
*Homepage da dohvaća samo od current usera balance

TODO:
*image gallery
*streak


NE TRIBA:
About
AdminLogin
BMICalculator
DefaultExercises
DefaultExercisesNA
DefaultMeals
DefaultMealsNA
ErrorPage
LocalTime
LogIn
MotivationalQuote
QRCodesAdmin
QRCodesDefault
Signup
UserBar
Notification


// dodamo si user id ili mail ili username da se po njemu filtrira (primary key u kolekciju usera, pa se po njemu filtrira. Podkolekcija za svega korisnika)
// Assume 'users' is your main collection and 'orders' is the subcollection
// 'userId' is the ID of the document in the 'users' collection
const userId = "some_user_id";

db.collection("users").doc(userId).collection("orders").get()
  .then(snapshot => {
    snapshot.forEach(doc => {
      console.log(doc.id, " => ", doc.data());
    });
  })
  .catch(error => {
    console.error("Error getting documents: ", error);
  });



#### Ovo će biti projekt iz kolegija "Programsko inženjerstvo"
#### Trainingapp (nije definitivni naziv)
#### Koncept aplikacije (ideja...moguće da će se modificirat u hodu)


#### TEST CREDENTIALS: 
#### mail: alabinjan6@gmail.com
#### password: Ovo_je_Lozinka?!1234

#### mail: antoniolabinjan5@gmail.com
#### password: PASSword!!!123456

#### admin: admin@trainingapp.com
#### password: 123456789
Aplikacija za praćenje raznih aktivnosti važnih za zdrav život i treniranje.

Te su aktivnosti: 
- kreiranje računa (login i signup)
- praćenje visine i težine
- praćenje odrađenih treninga
- praćenje konzumacije obroka
- praćenje sna
- praćenje unosa tekućine
- izračun Body mass indexa
- praćenje training streaka
- prijedlozi za odrađivanje vježbi
- prijedlozi za obroke
- music player
- praćenje kalorijskog balansa
- qr kod skener
https://www.figma.com/file/f8u5rOvTMgHEVSlU6denFg/Untitled?type=design&node-id=0%3A1&mode=design&t=brZMxneQCVA9nUOM-1    FIGMA LINK

