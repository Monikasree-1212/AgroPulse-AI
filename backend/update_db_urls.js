require("dotenv").config();
const mongoose = require("mongoose");

const mappings = [
  { old: /https?:\/\/agricoop\.nic\.in\/?/i, new: "https://agriwelfare.gov.in/" },
  { old: /https?:\/\/pmkisan\.gov\.in\/?/i, new: "https://pmkisan.gov.in/" },
  { old: /https?:\/\/enam\.gov\.in\/?/i, new: "https://enam.gov.in/" },
  { old: /https?:\/\/agmarknet\.gov\.in\/?/i, new: "https://agmarknet.gov.in/" },
  { old: /https?:\/\/pmfby\.gov\.in\/?/i, new: "https://pmfby.gov.in/" },
  { old: /https?:\/\/soilhealth\.dac\.gov\.in\/?/i, new: "https://soilhealth.dac.gov.in/" },
];

mongoose.connect(process.env.MONGO_URI, {})
  .then(async () => {
    const db = mongoose.connection.db;
    const schemes = await db.collection("governmentschemes").find({ website: { $exists: true } }).toArray();
    let updated = 0;

    for (const scheme of schemes) {
      if (!scheme.website) continue;
      let newWebsite = scheme.website;
      let matched = false;
      
      for (const mapping of mappings) {
        if (mapping.old.test(newWebsite)) {
          newWebsite = newWebsite.replace(mapping.old, mapping.new);
          matched = true;
        }
      }

      if (matched) {
        await db.collection("governmentschemes").updateOne(
          { _id: scheme._id },
          { $set: { website: newWebsite } }
        );
        updated++;
      }
    }
    console.log(`Successfully updated ${updated} documents in DB.`);
    process.exit(0);
  })
  .catch((e) => {
    console.error("DB Error:", e);
    process.exit(1);
  });
