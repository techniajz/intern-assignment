const moment = require('moment');
const axios = require('axios');
const {
    models: {
        Lead,
        LocationPreference,
        PropertyType
    },
} = require('../../../../lib/models');
class LeadService {
    magicBrickService = async (sourceData) => {
        let endDate = new Date();
        let startDate = new Date(endDate.getTime() - 4 * 24 * 60 * 60 * 1000);
        let formattedStartDate = moment.tz(startDate, 'Asia/Kolkata').format('YYYYMMDD');
        let formattedEndDate = moment.tz(endDate, 'Asia/Kolkata').format('YYYYMMDD');
        let url = sourceData.apiJsonPath+'&startDate='+formattedStartDate+'&endDate='+formattedEndDate;
        try{
            // const response = await axios.get(url, {
            //     params: {
            //         // startDate: formattedStartDate,
            //         // endDate: formattedEndDate
            //     }
            // });
            const response = {"leadPojo":{"leads":[{"msg":"This user is looking for 3 BHK Villa for Sale in Mansarovar Extension, Jaipur and has viewed your contact details.","city":"Jaipur","isd":"91","pid":"67931763","loginid":"39515679","dt":"20240302","tranType":"b","project":null,"email":"nabhdeepjoshi12@gmail.com","mobile":"7410979088","ph":null,"vdate":"20240302","vtime":"121000","pgcity":null,"pgname":null,"locality":"Mansarovar Extension","subject":"Subject","address":"Mansarovar Extension","name":"Nabhdeep","id":"1108542899","time":"120959"},{"msg":"This user is looking for 4 BHK Villa for Sale in Mansarovar, Jaipur and has viewed your contact details.","city":"Jaipur","isd":"91","pid":"71227167","loginid":"39515679","dt":"20240301","tranType":"b","project":null,"email":"jain.manisha564@gmail.com","mobile":"7340122586","ph":null,"vdate":"20240301","vtime":"194201","pgcity":null,"pgname":null,"locality":"Mansarovar","subject":"Subject","address":"Mansarovar","name":"Manisha","id":"1108312153","time":"194200"},{"msg":"This user is looking for 3 BHK Villa for Sale in Mansarovar, Jaipur and has viewed your contact details.","city":"Jaipur","isd":"91","pid":"71227125","loginid":"39515679","dt":"20240301","tranType":"b","project":null,"email":"rinkutundwal@ymail.com","mobile":"9602796297","ph":null,"vdate":"20240301","vtime":"181411","pgcity":null,"pgname":null,"locality":"Mansarovar","subject":"Subject","address":"Mansarovar","name":"JR","id":"1108221425","time":"161410"},{"msg":"This user is looking for 3 BHK Villa for Sale in Mansarovar Extension, Jaipur and has viewed your contact details.","city":"Jaipur","isd":"91","pid":"67931763","loginid":"39515679","dt":"20240301","tranType":"b","project":null,"email":"jai.bharwani.jb@gmail.com","mobile":"8290970566","ph":null,"vdate":"20240301","vtime":"145056","pgcity":null,"pgname":null,"locality":"Mansarovar Extension","subject":"Subject","address":"Mansarovar Extension","name":"Jai","id":"1108186759","time":"145055"},{"msg":"This user is looking for 3 BHK Villa for Sale in Mansarovar, Jaipur and has viewed your contact details.","city":"Jaipur","isd":"91","pid":"71227125","loginid":"39515679","dt":"20240301","tranType":"b","project":null,"email":"supriya3m@yahoo.com","mobile":"9811636355","ph":null,"vdate":"20240301","vtime":"135041","pgcity":null,"pgname":null,"locality":"Mansarovar","subject":"Subject","address":"Mansarovar","name":"Supriya","id":"1108159995","time":"135040"},{"msg":"This user is looking for 3 BHK Villa for Sale in Mansarovar Extension, Jaipur and has viewed your contact details.","city":"Jaipur","isd":"91","pid":"67931763","loginid":"39515679","dt":"20240301","tranType":"b","project":null,"email":"mkabsf@gmail.com","mobile":"9654024199","ph":null,"vdate":"20240301","vtime":"131947","pgcity":null,"pgname":null,"locality":"Mansarovar Extension","subject":"Subject","address":"Mansarovar Extension","name":"MaheshArya","id":"1108144583","time":"131946"},{"msg":"This user is looking for 4 BHK Villa for Sale in Mansarovar Extension, Jaipur and has viewed your contact details.","city":"Jaipur","isd":"91","pid":"68655955","loginid":"39515679","dt":"20240228","tranType":"b","project":null,"email":"sourabhmittal05@gmail.com","mobile":"8955306742","ph":null,"vdate":"20240228","vtime":"214141","pgcity":null,"pgname":null,"locality":"Mansarovar Extension","subject":"Subject","address":"Mansarovar Extension","name":"sourabh","id":"1107450835","time":"194141"},{"msg":"This user is looking for 3 BHK Multistorey Apartment for Sale in Mansarovar Extension, Jaipur and has viewed your contact details.","city":"Jaipur","isd":"91","pid":"68644747","loginid":"39515679","dt":"20240228","tranType":"b","project":null,"email":"vishalguddujain@gmail.com","mobile":"6350477105","ph":null,"vdate":"20240228","vtime":"203316","pgcity":null,"pgname":null,"locality":"Mansarovar Extension","subject":"Subject","address":"Mansarovar Extension","name":"Priyanka Jain","id":"1107472983","time":"203316"},{"msg":"This user is looking for 4 BHK Villa for Sale in Mansarovar, Jaipur and has viewed your contact details.","city":"Jaipur","isd":"91","pid":"68646819","loginid":"39515679","dt":"20240228","tranType":"b","project":null,"email":"jai.bharwani.jb@gmail.com","mobile":"8290970566","ph":null,"vdate":"20240228","vtime":"123116","pgcity":null,"pgname":null,"locality":"Mansarovar","subject":"Subject","address":"Mansarovar","name":"Jai","id":"1107238139","time":"123116"},{"msg":"This user is looking for 3 BHK Villa for Sale in Chitrakoot, Jaipur and has viewed your contact details.","city":"Jaipur","isd":"91","pid":"70680891","loginid":"39515679","dt":"20240228","tranType":"b","project":null,"email":"7878952600@timesgroup.com","mobile":"7878952600","ph":null,"vdate":"20240228","vtime":"101456","pgcity":null,"pgname":null,"locality":"Chitrakoot","subject":"Subject","address":"Chitrakoot","name":"Shivsa","id":"1107143987","time":"081456"},{"msg":"This user is looking for 5 BHK Villa for Sale in Mansarovar Extension, Jaipur and has viewed your contact details.","city":"Jaipur","isd":"91","pid":"68313361","loginid":"39515679","dt":"20240227","tranType":"b","project":null,"email":"bbah30878@gmail.com","mobile":"8618766723","ph":null,"vdate":"20240227","vtime":"014741","pgcity":null,"pgname":null,"locality":"Mansarovar Extension","subject":"Subject","address":"Mansarovar Extension","name":"kumar","id":"1106630001","time":"014741"}],"errormsg":null,"count":11,"status":"success"}};
            let data = response;
            if (data.leadPojo.status === 'error') {
                return { status: false, message: data.leadPojo.errormsg, data: data };
            }

            if (data.leadPojo.status === 'success') {
                let leadData = data.leadPojo.leads;
                if (leadData && leadData.length > 0) {
                    await Promise.all(leadData.map(async (item) => {
                        let mappedData = await this.mappingMagicBrickLeadData(item);
                        mappedData.crmApi = [{
                            type: 'magicBricks',
                            referenceId: item.id
                        }];
                        mappedData.apiResponse = JSON.stringify(item);
                        const existingLead = await Lead.findOne({ 'crmApi.referenceId': item.id, 'crmApi.type': 'magicBricks' });
                        if (existingLead) {
                            Object.assign(existingLead, mappedData);
                            await existingLead.save();
                        } else {
                           let leadResponse = await Lead.create(mappedData);
                           console.log(leadResponse);
                        //    let findAdmins = await Employee.find({ role: 'Admin' });
                        //     let formattedLeadDate = dateLead.format('YYYYMMDDHHmm');
                        //     findAdmins.map(async admin => {
                        //         let assignObj = {};
                        //         assignObj['LeadId'] = newLeadData._id;
                        //         assignObj['assignTo'] = admin._id;
                        //         assignObj['leadDate'] = formattedLeadDate;
                        //         assignObj['assignBy'] = admin._id;
                        //         await new AssignLead(assignObj).save();
                        //     });
                        }
                    }));
                }
                return { status: true, data: data, message: 'API fetched successfully' };
            }
        } catch(err) {
            console.log(err.message);
        }
    }

    mappingMagicBrickLeadData = async (leadData) => {
        let msg = leadData.msg;
        let locationPreference = await LocationPreference.find({})
            .select('name');
        let foundId = [];
        if (locationPreference && locationPreference.length > 0) {
            foundId = await this.findLocationPrefrenceId(locationPreference,msg);
        }
        // If no matches found in LocationPreference, search in leadData.locality and leadData.address
        if (foundId.length === 0 && locationPreference.length > 0) {
            if (leadData.locality) {
                let localityName = leadData.locality;
                foundId = await this.findLocationPrefrenceId(locationPreference,localityName);
            }
            if (foundId.length === 0 && leadData.address) {
                let addressName = leadData.address;
                foundId = await this.findLocationPrefrenceId(locationPreference,addressName);
            }
        }
        //find number of bhk
        let numberOfBhk = this.findNumberOfBhk(msg);
        let propertytypes = await PropertyType.find({}).select('name');
        let propertyTypeId = this.findPropertyReferanceId(propertytypes,msg);

        let mapped = {
            photo: "",
            workingProfile: "",
            yearlyIncome: "",
            alternateNumber: "",
            // leadSources: "",
            // projectId: "",
            leadStatus: 1,
            // timeline: "",
            comments: leadData.msg,
            // leadLabel: "",
            gender: "",
            age: "",
            Occupation: "",
            leadFile: "",
            startVisit: false,
            isActive: true,
            isDeleted: false,
            name: leadData.name,
            phone: leadData.mobile,
            propertyPreferences: {
                budgetRange: "",
                NumberOfBHK: numberOfBhk ? numberOfBhk : ''
            },
            leadDate: moment(leadData.vdate, 'YYYYMMDD').valueOf(),
            created: new Date(),
            updated: new Date(),
        };
        if(propertyTypeId.length > 0){
            mapped.propertyPreferences.propertyType = propertyTypeId[0];
        }
        if(foundId.length > 0){
            mapped.propertyPreferences.locationpreferences = foundId[0];
        }
        return mapped;
    }

    findLocationPrefrenceId = async(locationPreference,message)=>{
            let foundLocations = locationPreference.filter(location => {
                let regex = new RegExp('\\b' + location.name.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '\\b', 'i');
                return regex.test(message);
            });
            // Extract _id of the found locations
            let foundIds = foundLocations.map(location => location._id);
            return foundIds;
    }

    findNumberOfBhk = (message) => {
        let regex = /\b(\d+)\s+(BHK|bhk)\b/i;
        let match = message.match(regex);
        let numberOfBHK = match ? parseInt(match[1]) : null;
        return numberOfBHK;
    }

    findPropertyReferanceId = (propertyTypes, message) => {
        let matchingIds = [];
        propertyTypes.forEach(property => {
            let regex = new RegExp('\\b' + property.name + '\\b', 'i');
            if (regex.test(message)) {
                matchingIds.push(property._id);
            }
        });
        return matchingIds;
    }
}

module.exports = new LeadService();