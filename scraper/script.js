const basicUrl = "https://api.fostplus.be/recyclecms/public/v1";
const consumerHeader = {
    'Content-Type': 'application/json',
    'x-consumer': 'recycleapp.be'
};

const args = process.argv.slice(2);
const language = args[0] || "en";
const postcode = args[1] || "8500";
const streetName = args[2] || "Sint-Martens-Latemlaan";
const houseNumber = args[3] || "2";

async function getCollectionInfo() {
    try {

        const postcodeResponse = await fetch(`${basicUrl}/zipcodes?q=${postcode}`, {
            headers: consumerHeader
        });
        const postcodeData = await postcodeResponse.json();

        if (!postcodeData.items || postcodeData.items.length === 0) {
            throw new Error("Postcode not found.");
        }

        let postcodeId;
        for (const item of postcodeData.items) {
            if (item.code === postcode) {
                postcodeId = item.id;
                break;
            }
        }

        if (!postcodeId) {
            throw new Error("Postcode not found.");
        }

        const streetResponse = await fetch(`${basicUrl}/streets?q=${streetName}&zipcodes=${postcodeId}`, {
            headers: consumerHeader
        });
        const streetData = await streetResponse.json();

        if (!streetData.items || streetData.items.length === 0) {
            throw new Error("Street not found.");
        }
        const streetId = streetData.items[0].id;

        const collectionUrl = `${basicUrl}/collections?zipcodeId=${postcodeId}&streetId=${streetId}&houseNumber=${houseNumber}&fromDate=2024-10-01&untilDate=2024-11-30&size=100`;

        const collectionResponse = await fetch(collectionUrl, {
            headers: consumerHeader
        });

        if (!collectionResponse.ok) {
            throw new Error("Failed to fetch collection data.");
        }

        return await collectionResponse.json();

    } catch (error) {
        console.error("Error fetching data:", error.message);
    }
}

async function displayCollectionInfo() {
    try {
        const collectionData = await getCollectionInfo();
        const collections = collectionData.items;

        if (!collections || collections.length === 0) {
            console.log("No collections found.");
            return;
        }

        const outputArray = collections.map(collection => {
            const fractionName = language === "nl" ? collection.fraction.name.nl : collection.fraction.name.en;
            const fractionLogoName = collection.fraction.logo.name.en;
            const date = new Date(collection.timestamp);
            const formattedDate = date.toLocaleDateString('nl-NL', {year: 'numeric', month: '2-digit', day: '2-digit'});
            return {
                date: formattedDate,
                fraction: fractionName,
                fractionLogoName : fractionLogoName
            };
        });

        console.log(JSON.stringify(outputArray, null, 2));

    } catch (error) {
        console.error("Error fetching data:", error.message);
    }
}

displayCollectionInfo();
