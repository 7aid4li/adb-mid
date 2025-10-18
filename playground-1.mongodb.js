// seed.js
// Create DB `postcrossing_db` with users, countries, postcards, matches.

// Use database
use('postcrossing_db')

// Clear previous (for idempotent runs)
db.users.drop();
db.countries.drop();
db.postcards.drop();
db.matches.drop();

// ---------- Countries (small predefined list) ----------
const countries = [
  { _id: ObjectId("64f0000000000000000000a1"), countryCode: "CN", countryName: "China", totalSent: 0, totalReceived: 0 },
  { _id: ObjectId("64f0000000000000000000a2"), countryCode: "US", countryName: "United States", totalSent: 0, totalReceived: 0 },
  { _id: ObjectId("64f0000000000000000000a3"), countryCode: "CL", countryName: "Chile", totalSent: 0, totalReceived: 0 },
  { _id: ObjectId("64f0000000000000000000a4"), countryCode: "PK", countryName: "Pakistan", totalSent: 0, totalReceived: 0 },
  { _id: ObjectId("64f0000000000000000000a5"), countryCode: "DE", countryName: "Germany", totalSent: 0, totalReceived: 0 }
];
db.countries.insertMany(countries);

// ---------- Users (full profile) ----------
const users = [
  {
    _id: ObjectId("64f1000000000000000000b1"),
    username: "zaid_ali",
    email: "zaid@example.com",
    passwordHash: "HASH_PLACEHOLDER",
    fullName: "Zaid Ali",
    countryCode: "PK",
    profilePictureUrl: "https://example.com/profiles/zaid.jpg",
    bio: "Loves postcards and vintage stamps.",
    joinDate: ISODate("2024-09-01T10:00:00Z"),
    stats: { totalSent: 2, totalReceived: 2 },
    sentPostcards: [],
    receivedPostcards: []
  },
  {
    _id: ObjectId("64f1000000000000000000b2"),
    username: "anna_us",
    email: "anna@example.com",
    passwordHash: "HASH_PLACEHOLDER",
    fullName: "Anna Smith",
    countryCode: "US",
    profilePictureUrl: "https://example.com/profiles/anna.jpg",
    bio: "Collector of seaside postcards.",
    joinDate: ISODate("2024-08-15T08:30:00Z"),
    stats: { totalSent: 2, totalReceived: 1 },
    sentPostcards: [],
    receivedPostcards: []
  },
  {
    _id: ObjectId("64f1000000000000000000b3"),
    username: "li_chen",
    email: "li@example.com",
    passwordHash: "HASH_PLACEHOLDER",
    fullName: "Li Chen",
    countryCode: "CN",
    profilePictureUrl: "https://example.com/profiles/li.jpg",
    bio: "Tea, postcards, and calligraphy.",
    joinDate: ISODate("2024-07-21T14:00:00Z"),
    stats: { totalSent: 3, totalReceived: 3 },
    sentPostcards: [],
    receivedPostcards: []
  },
  {
    _id: ObjectId("64f1000000000000000000b4"),
    username: "marco_cl",
    email: "marco@example.com",
    passwordHash: "HASH_PLACEHOLDER",
    fullName: "Marco Alvarez",
    countryCode: "CL",
    profilePictureUrl: "https://example.com/profiles/marco.jpg",
    bio: "From Santiago, loves mountains.",
    joinDate: ISODate("2024-06-11T12:45:00Z"),
    stats: { totalSent: 1, totalReceived: 1 },
    sentPostcards: [],
    receivedPostcards: []
  },
  {
    _id: ObjectId("64f1000000000000000000b5"),
    username: "sophie_de",
    email: "sophie@example.com",
    passwordHash: "HASH_PLACEHOLDER",
    fullName: "Sophie Klein",
    countryCode: "DE",
    profilePictureUrl: "https://example.com/profiles/sophie.jpg",
    bio: "Photography and urban postcards.",
    joinDate: ISODate("2024-10-03T09:20:00Z"),
    stats: { totalSent: 0, totalReceived: 0 },
    sentPostcards: [],
    receivedPostcards: []
  }
];
db.users.insertMany(users);

// ---------- Postcards (some with reciprocal pairs simulated) ----------
const postcards = [
  // 1: Li (CN) -> Zaid (PK)
  {
    _id: ObjectId("64f2000000000000000000c1"),
    postcardID: "CN-408790",
    senderId: ObjectId("64f1000000000000000000b3"),
    receiverId: ObjectId("64f1000000000000000000b1"),
    countryFrom: "CN",
    countryTo: "PK",
    sentDate: ISODate("2024-09-30T05:00:00Z"),
    receivedDate: ISODate("2024-10-07T10:00:00Z"),
    status: "received",
    message: "Greetings from Shanghai!",
    imageUrl: "https://example.com/postcards/cn-408790.jpg"
  },
  // reciprocal: Zaid (PK) -> Li (CN)
  {
    _id: ObjectId("64f2000000000000000000c2"),
    postcardID: "PK-009001",
    senderId: ObjectId("64f1000000000000000000b1"),
    receiverId: ObjectId("64f1000000000000000000b3"),
    countryFrom: "PK",
    countryTo: "CN",
    sentDate: ISODate("2024-10-03T11:00:00Z"),
    receivedDate: ISODate("2024-10-12T12:00:00Z"),
    status: "received",
    message: "Hello from Lahore!",
    imageUrl: "https://example.com/postcards/pk-009001.jpg"
  },
  // 3: Marco (CL) -> Anna (US)
  {
    _id: ObjectId("64f2000000000000000000c3"),
    postcardID: "CL-34269",
    senderId: ObjectId("64f1000000000000000000b4"),
    receiverId: ObjectId("64f1000000000000000000b2"),
    countryFrom: "CL",
    countryTo: "US",
    sentDate: ISODate("2024-10-01T07:30:00Z"),
    receivedDate: ISODate("2024-10-14T09:45:00Z"),
    status: "received",
    message: "A view from Chilean Andes.",
    imageUrl: "https://example.com/postcards/cl-34269.jpg"
  },
  // 4: Anna (US) -> Marco (CL) (reciprocal)
  {
    _id: ObjectId("64f2000000000000000000c4"),
    postcardID: "US-11797804",
    senderId: ObjectId("64f1000000000000000000b2"),
    receiverId: ObjectId("64f1000000000000000000b4".replace('0000','0000')), // keep id stable - replaced properly below
    countryFrom: "US",
    countryTo: "CL",
    sentDate: ISODate("2024-10-05T13:00:00Z"),
    receivedDate: ISODate("2024-10-20T16:00:00Z"),
    status: "received",
    message: "Greetings from California!",
    imageUrl: "https://example.com/postcards/us-11797804.jpg"
  },
  // 5: Li (CN) -> Sophie (DE) - not yet received
  {
    _id: ObjectId("64f2000000000000000000c5"),
    postcardID: "CN-999123",
    senderId: ObjectId("64f1000000000000000000b3"),
    receiverId: ObjectId("64f1000000000000000000b5"),
    countryFrom: "CN",
    countryTo: "DE",
    sentDate: ISODate("2024-10-10T09:00:00Z"),
    receivedDate: null,
    status: "sent",
    message: "Hope you like city photos!",
    imageUrl: "https://example.com/postcards/cn-999123.jpg"
  },
  // 6: Anna (US) -> Zaid (PK)
  {
    _id: ObjectId("64f2000000000000000000c6"),
    postcardID: "US-11797805",
    senderId: ObjectId("64f1000000000000000000b2"),
    receiverId: ObjectId("64f1000000000000000000b1"),
    countryFrom: "US",
    countryTo: "PK",
    sentDate: ISODate("2024-10-11T15:00:00Z"),
    receivedDate: null,
    status: "sent",
    message: "Postcard from the coast!",
    imageUrl: "https://example.com/postcards/us-11797805.jpg"
  },
  // 7: Sophie (DE) -> Li (CN) (reciprocal later)
  {
    _id: ObjectId("64f2000000000000000000c7"),
    postcardID: "DE-55001",
    senderId: ObjectId("64f1000000000000000000b5"),
    receiverId: ObjectId("64f1000000000000000000b3".replace('0000','0000')),
    countryFrom: "DE",
    countryTo: "CN",
    sentDate: ISODate("2024-10-20T12:00:00Z"),
    receivedDate: null,
    status: "sent",
    message: "A small hello from Berlin.",
    imageUrl: "https://example.com/postcards/de-55001.jpg"
  }
];

// NOTE: ensure receiverId ObjectIds reference actual inserted user IDs
postcards[3].receiverId = ObjectId("64f1000000000000000000b4"); // US-11797804 -> receiver Marco
postcards[6].receiverId = ObjectId("64f1000000000000000000b3"); // DE-55001 -> receiver Li

db.postcards.insertMany(postcards);

// ---------- Update users' sentPostcards and receivedPostcards & stats ----------
function pushToUser(userId, field, postcardId) {
  const u = db.users.findOne({ _id: userId });
  if (!u) return;
  db.users.updateOne({ _id: userId }, { $push: { [field]: postcardId }});
}

const allPostcards = db.postcards.find().toArray();
allPostcards.forEach(pc => {
  if (pc.senderId) pushToUser(pc.senderId, "sentPostcards", pc._id);
  if (pc.receiverId) pushToUser(pc.receiverId, "receivedPostcards", pc._id);
});

// Update stats counts
db.users.find().forEach(u => {
  const sentCount = (u.sentPostcards || []).length;
  const recCount = (u.receivedPostcards || []).length;
  db.users.updateOne({ _id: u._id }, { $set: { "stats.totalSent": sentCount, "stats.totalReceived": recCount }});
});

// ---------- Matches (represent reciprocal pairing) ----------
// We simulate that CN-408790 <-> PK-009001 are a reciprocal match, and CL-34269 <-> US-11797804
const matches = [
  {
    _id: ObjectId("64f3000000000000000000d1"),
    initiatorPostcardId: ObjectId("64f2000000000000000000c1"),
    reciprocalPostcardId: ObjectId("64f2000000000000000000c2"),
    createdAt: new Date()
  },
  {
    _id: ObjectId("64f3000000000000000000d2"),
    initiatorPostcardId: ObjectId("64f2000000000000000000c3"),
    reciprocalPostcardId: ObjectId("64f2000000000000000000c4"),
    createdAt: new Date()
  }
];
db.matches.insertMany(matches);

// ---------- Update countries totals ----------
db.postcards.find().forEach(pc => {
  db.countries.updateOne({ countryCode: pc.countryFrom }, { $inc: { totalSent: 1 }});
  db.countries.updateOne({ countryCode: pc.countryTo }, { $inc: { totalReceived: 1 }});
});

// ---------- Create recommended indexes ----------
db.users.createIndex({ username: 1 }, { unique: true });
db.users.createIndex({ email: 1 }, { unique: true });
db.postcards.createIndex({ postcardID: 1 });
db.postcards.createIndex({ senderId: 1 });
db.postcards.createIndex({ receiverId: 1 });
db.countries.createIndex({ countryCode: 1 }, { unique: true });

// Done
print("Seed complete. Users:", db.users.countDocuments(), "Postcards:", db.postcards.countDocuments(), "Matches:", db.matches.countDocuments(), "Countries:", db.countries.countDocuments());
