const locale = {
   /**Auth API's */
    LOGIN_SUCCESS: 'Logged-In successfully.',
    LOGOUT_SUCCESS: 'Logged-Out successfully.',
    USER_NOT_REGISTER:'You are not register in this app',
    USER_DOES_NOT:'User does not exit',
    EMAIL_NOT_VERIFY:'Please verify your email',  
    USER_NOT_APPROV:'Your Account Has Been Not Approved By Admin',
    YOUR_ACCOUNT_SUSPENDED: 'Your Account Has Been Suspended By Admin',
    INCORRECT_EMAIL_PASSWORDS:'Please enter correct email or password',
    OTP_VERIFY_TO_LOGIN:'Please Verify OTP To LogIn',
    ENTER_PASSWORD_TO_LOGIN:'Enter Password to login',
    OTP_VERIFY_SUCCESS:'OTP verify successfully.',
    INVALID_OTP: 'Invalid OTP.',
    OTP_SEND_SUCCESS:'OTP has been sent successfully.',
    USER_NAME_ALREADY_EXISTS: 'User name already exists',
    MOBILE_ALREADY_EXISTS:'Mobile number already exists',
    EMAIL_ALREADY_EXISTS:'Email already exists',
    CONFIRM_PASSWORD:'Confirm Password must match new password.',
    OTP_VERIFY_TO_SIGNIN:'Please Verify OTP To Complete Your Registration',
    EMAIL_NOT_REGISTER:'The email address is not registered',
    OTP_SEND_TO_CHANGE_PASSWORD:'OTP Has Been Sent Please Verify OTP & Change Password',
    UNAUTHORIZED: 'Unauthorized access.',
    PASSWORD_CHANGED: 'Password changed successfully.',
    CREATE_PROFILE_SUCCESS:'create profile successfully',
    PASSWORD_MIS_MATCH: 'The password does not match',
    PASSWORD_MATCH_FAILURE: 'Entered password doesn\'t match the old password.',
    PASSWORD_UPDATED_SUCCESS: 'Password updated successfully.',
    DETAIL_FETCHED_SUCCESS:'Details has been fetched successfully',
    AVATAR_FETCHED_SUCCESS:'Find avatar photos successfully',
    PROFILE_FETCHED_SUCCESS:'Profile has been fetched successfully',
    EMAIL_REQUIRED:'Email is required',
    USER_NAME_REQUIRED:'User name is required',

    /**Lobby API's */
    FETCH_ALL_SPORTS_SUCCESS:'Find all lobbies list successfully',
    FETCH_ALL_CONTEST_DETAILS_SUCCESS:'Find all contests details successfully',
    FETCH_CONTEST_DETAILS_SUCCESS:'Find contest details successfully',
    DUE_TO_MAX_ENTRANTS:'Due to the maximum number of entrants, you are not eligible to participate',
    DRAFTING_TIME_EXPIRED:'The drafting time has expired, so you cannot join the contest',
    MAX_JOINING_LIMIT_REACHED:'Your maximum joining limit has been reached! you can not join this contest',
    NOT_ENOUGH_BLANCE_TO_PARTICIPATE_CONTEST:'Your account does not have enough balance to participate in the contest',
    CONTEST_CAN_NOT_JOIN_DUETO_INSUFFICIENT_BLANCE:'Contest cannot be joined due to insufficient balance in your account',
    CONTEST_JOINED_SUCCESS:'The contest has been successfully joined',
    CONTEST_LEFT_SUCCESS:'successfully left the contest',
    CONTEST_ALREADY_LEFT:'Already left the contest',
    CONTEST_NOT_AVAILABLE:'The contest is not available',
    FETCH_CONTEST_SCORING:'Find contest scoring successfully',
    FETCH_SLIDER_IMAGES_SUCCESS:'Find all slider images successfully',
    FETCH_CONTEST_ENTRANTS_SUCCESS:'Find all contest entrants successfully',

    /**MyTeams API's*/
    FETCH_JOINED_CONTESTS_SUCCESS:'Find my joined contests list successfully',
    DATA_NOT_AVAILABLE:'Data not available',
    FETCH_JOINED_CONTESTS_DETAIL_SUCCESS:'Find my joined contests detail successfully',
    FETCH_CONTESTS_STANDING_SUCCESS:'Find contests standing successfully',
    FETCH_CONTEST_MEMBERS_SUCCESS:'Find my contest members successfully',

    //draft
    INVALID_ROSTER_CONSTRUCTION:'The rotor construction is invalid',
    PLAYERS_UPDATE_SUCCESS:'Players updated successfully',

    //crons
    TEAM_CREATED_SUCCESS:'Team created successfully',
    UPDATE_ALL_TEAMS_SECCESS:'Update all team successfully',
    FETCH_ALL_ACTIVE_TOURNAMENTS:'Find All Active Tournament',
    EVENT_CREATED_SUCCESS:'Events created successfully',
    CREATE_COMPETITORS_SUCCESS:'Competitors created successfully',
    FETCH_EVENTS_SUCCESS:'Find events successfully',
    FETCH_TOURNAMENTS_LIST_SUCCESS:'Find tournament list successfully',
    FETCH_TEAMS_LIST_SUCCESS:'Find teams list successfully',
    FETCH_LIVE_CONTESTS_SUCCESS:"Find Live contests successfully",
    FETCH_EVENTS_STATS_SUCCESS:'find All evets stats successfully',
   
    //Contests
    CREATE_CONTEST_SUCCESS:'Create contest successfully',
    CONTEST_MEMBERS_NOT_FOUND:'Contest member not found',
    FETCH_ALL_PLAYERS_SUCCESS:'Find all players successfully',

    //Contest config
    FETCH_ALL_GAMES_SUCCESS:'Find All Games Successfully',
    FETCH_CONTEST_TYPES_SUCCESS:'Find Contest Types Successfully',
    FETCH_ALL_CONTEST_TYPES_SUCCESS:'Find All Contest Types Successfully',
    FETCH_GAME_TYPES_SUCCESS:'Find Game Types Successfully',
    FETCH_ALL_GAME_TYPES_SUCCESS:'Find all game Types Successfully',
    FETCH_GAME_DURATION_SUCCESS:'Find durations Successfully',
    FETCH_ALL_GAME_DURATION_SUCCESS:'Find all game durations Successfully',
    FETCH_ALL_DRAFT_SPEED_SUCCESS:'Find All Draft Speed Successfully',

    //Currencies
    FETCH_ALL_CURRENCIES_SUCCESS:'Find All currencies Successfully',

    //Feeds
    CREATE_FEED_SUCCESS:'Create Feed Successfully',
    CONTEST_NOT_EXIST:'Contest not exist',
    CREATE_COMMENT_SUCCESS:'Create Comment Successfully',
    FEED_UNLIKE_SUCCESS:'feed Unlike successfully',
    FEED_LIKE_SUCCESS:'feed like successfully',
    FEED_UNHIDE_SUCCESS:'Feed UnHide Successfully',
    FEED_HIDE_SUCCESS:'Feed Hide Successfully',
    FEED_ALREADY_REPORTED:'This feed has already been reported',
    FEED_REPORTED_SUCCESS:'Feed reported successfully',
    FEED_ALREADY_BLOCKED:'This feed has already been blocked',
    FEED_BLOCKED_SUCCESS:'Feed blocked successfully',
    FEED_SHARE_SUCCESS:'feed share successfully',
    FETCH_ALL_FEED_SUCCESS:'Find all feed successfully',
    FETCH_ALL_FEED_COMMENTS:'Find all feed comments successfully',
    FETCH_ALL_FEED_LIKES_SUCCESS:'Find All feed liks successfully',
    COMMENT_DELETE_SUCCESS:'Comment delete successfully',
    DONT_DELETE_ANOTHER_USERS_COMMENTS:"Don't delete another user's comment",

    //Global stats
    UPDATE_GLOBAL_STATS:'Updated all global stats for all players',
    FETCH_ROSTER_POSITION:'Find all roste position successfully',
    FETCH_SCORING_CATEGORIES:'Find all scoring categories successfully',
    FETCH_ALL_SEASON_SUCCESS:'Find all season successfully',

    //Stats API'S
    FETCH_ALL_TOURNAMENT_SUCCESS:'Find all tournament successfully',
    UPDATE_ALL_TEAM_SUCCESS:'Update all team successfully',
    FETCH_ALL_PLAYERS_SUCCESS:'Find all players successfully',
    FETCH_ALL_EVENTS_SUCCESS:'Find all events successfull',
    FETCH_ALL_COMPETITORS_SUCCESS:'Find all competitors successfully',
    INSERT_ALL_PLAYERS_STATS_SUCCESS:'Insert all players stats successfully',
    FETCH_STATS_PLAYERS_SUCCESS:'Find stats players successfully',
    FETCH_All_TOURNAMENT_PLAYERS_GLOBLE_STATS_SUCCESS:'Find all tournament players global stats',


    GENERAL_ERROR: 'An error occurred.',
    USER_NOT_FOUND: 'This email address isn\'t registered with us.',
    SOCIAL_USER_NOT_FOUND: 'This user isn\'t registered with us.',
    INVALID_CREDENTIALS: 'Invalid email or password.',
    PROFILE_UPDATED: 'Profile updated successfully.',
    passwordPattern: 'at least 8 characters with at least 1 alphabet and 1 digit',
    PAGE_NOT_EXISTS: 'Page not exists.',
    PAGE_STATUS_UPDATED: 'Page status updated successfully.',
    PAGE_UPDATED: 'Page updated successfully.',
    PAGE_DESCRIPTION_REQUIRED: 'Page Description is Required.',
    INVALID_RESET_PASS_REQUEST: 'Invalid reset password request.',
    INVALID_REQUEST: 'Invalid Request.',
    FORGOT_PASSWORD_MAIL_SUCCESS: 'Forgot password email sent successfully.',
    EMAIL_RESET_PASSWORD: 'Reset password email.',
    SETTINGS_PAGE_NOT_FOUND: 'Settings page not found.',
    SETTINGS_UPDATE_SUCCESS: 'Settings Updated Successfully.',
    USER_NOT_EXISTS: 'User not exists.',
    USER_STATUS_UPDATED: 'User updated successfully.',
    USER_DELETE_SUCCESS: 'User delete successfully.',
    CATEGORIES_NOT_EXISTS: 'Category not exists.',
    CATEGORIES_ADD_SUCCESS: 'Category added successfully.',
    CATEGORIES_UPDATED_SUCCESS: 'Category updated successfully.',
    CATEGORIES_STATUS_UPDATE_SUCCESS: 'Category status update successfully.',
    CATEGORIES_DELETE_SUCCESS: 'Category delete successfully.',
    RESET_EMAIL_FORGOT:'We have sent reset password instructions to your email address!',
    EMAIL_VERIFY_MAIL_SEND:'Email Not verified, we send verification email, Please verify email.',
    INVITATION_EMAIL_SENT:'Invitation email has been sent successfully',
    EMAIL_NOT_SENT:'Sending email failed',
    MOBILE_NO_EXISTS:'Mobile number is already used',
    EMAIL_AND_OTP_SENT: 'Email and mobile is not verified, please verify it',
    USER_NOT_VERIFY:'User is not verified by admin',
    ITEM_ADDED_TO_CART:'Product has been successfully added to the cart',
    CHECKOUT_SUCCESS: 'Proceed to checkout has been successfully completed',
    Profile_Information:'Profile information has been successfully recevied',
    LOGIN_WITH_PRACTICE_ROLE:'Please login with practice type user',
    SEARCH_SUCCESSFULLY:'Search Vendor is successful',
    MOBILE_NUMBER_NOT_REGISTER:'Mobile number is not registered',
    PROFILE_NOT_VERIFIED:'Your profile is not completed, please complete your profile. ',
    MOBILE_NOT_VERIFIED:'Mobie is not verified, please verify it',
    ADDED_LEAD:'Your information has been successfully submitted',
    ORDER_NOT_PLACED: 'Your order is not placed',
    ORDER_PLACED:'Your order has been successfully placed',
    PRODUCT_NOT_EXISTS: 'Product not exists.',
    PRODUCT_ADD_SUCCESS: 'Product added successfully.',
    PRODUCT_UPDATED_SUCCESS: 'Product updated successfully.',
    PRODUCT_STATUS_UPDATE_SUCCESS: 'Product status update successfully.',
    PRODUCT_DELETE_SUCCESS: 'Product delete successfully.',
    GET_ORDER_HISTORY:'Order history has been successfully fetched',
    STORE_NOT_EXISTS: 'Store not exists.',
    STORE_ADD_SUCCESS: 'Store added successfully.',
    STORE_UPDATED_SUCCESS: 'Store updated successfully.',
    STORE_STATUS_UPDATE_SUCCESS: 'Store status update successfully.',
    STORE_DELETE_SUCCESS: 'Store delete successfully.',
    EMAIL_ADDRESS_ALREDY_ASSOCIATED:'This practice is already associated',
    EMAIL_ADDRESS_SUCCESSFULLY_ASSOCIATED:'Practice has been successfully associated ',
    ASSOC_LIST:'Associated practice list has been fetched successfully ',
    ASSOC_ERROR_LIST:'Error found during fetching associated practice list',
    EMAIL_EXISTS:'This email address already exists.',
    ASSOCIATED_USER_REMOVED:'Associated practice has been removed successfully',
    IMAGE_SUCCESS:'Profile image has been updated successfully',
    AVAILBLITY_SET:'Product availbility has been set successfully',
    OFFER_PRICE_SUBMITTED:'Offer price has been set successfully',
    INVAILD_VENDOR_ID:'Invalid vendor',

    CONFIRM_ALERT_FETCHED: 'Confirmed Alerts fetched successfully',
    CREATED_ALERTS:'User created alerts fetched successfully',
    ALL_ALERTS:'All Alerts fetched successfully',
    ALERT_ADDED:'Alert added successfully',
    NOTIFICATION:'All Notifications fetched successfully',
    NOTIFICATION_ADDED:'Notifications added sucessfully',
    NOT_FOUND: 'Alert does not exists',
    ALERT_DELETED:'Deleted alert successfully',
    ALERT_FETCHED:'Alerts within the radius and all alert types fetched',

    BUYING_GROUP_NOT_ASSIGNED: 'Buying Group is not assigned to this practice!',
    PRACTICE_ADD_SUCCESS: 'Practice added successfully.',
    PRACTICE_NOT_EXISTS : 'Practice not exists.',
    PRACTICE_UPDATED_SUCCESS: 'Practice updated successfully.',
    PRACTICE_STATUS_UPDATED: 'Practice updated successfully.',
    PRACTICE_DELETE_SUCCESS: 'Practice deleted successfully.',
    SEARCH_SUCCESSFULLY:'Vendor search sucessfully',
    PRACTICE_ADD_FORM: {
        business_name: {
            required: 'Business Name is required.',
            minlength: 'Business Name is required to be minimum 3 chars.',
            maxlength: 'Business Name is required to be maximum 50 chars.',
        },
        owner_name: {
            required: 'Owner Name is required.',
            minlength: 'Owner Name is required to be minimum 3 chars.',
            maxlength: 'Owner Name is required to be maximum 30 chars.',
        },
        city: {
            required: 'City is required.'
        },
        state: {
            required: 'State is required.'
        },
        zip: {
            required: 'Zip Code is required.'
        },
        email: {
            required: 'Email is required.',
            minlength: 'Email is required to be minimum 3 chars.',
            maxlength: 'Email is required to be maximum 80 chars.',
            pattern: 'Email is required to be a valid email.',
            remote: 'This email address already exists.'
        },
        mobile: {
            required: 'Mobile number is required.',
            pattern: 'Mobile number is required to be a valid number.',
        },
        direct_phone_no: {
            required: 'Direct Phone Number is required.',
        },
        veterinary_license_number: {
            required: 'Veterinary License Number is required.',
        },
        shipping_address: {
            required: 'Shipping Address is required.',
        },
        password: {
            required: 'Veterinary License Number is required.',
        },
        confirm_password: {
            required: 'Veterinary License Number is required.',
        }
    },

    BUYINGGROUP_ADD_SUCCESS: "Practice added successfully.",
    BUYINGGROUP_NOT_EXISTS : "Practice not exists.",
    BUYINGGROUP_UPDATED_SUCCESS: 'Practice updated successfully.',
    BUYINGGROUP_STATUS_UPDATED: 'Practice updated successfully.',
    BUYINGGROUP_DELETE_SUCCESS: 'Practice deleted successfully.',
    BUYINGGROUP_ADD_FORM: {
        business_name: {
            required: 'Business Name is required.',
            minlength: 'Business Name is required to be minimum 3 chars.',
            maxlength: 'Business Name is required to be maximum 50 chars.',
        },
        owner_name: {
            required: 'Admin Name is required.',
            minlength: 'Admin Name is required to be minimum 3 chars.',
            maxlength: 'Admin Name is required to be maximum 30 chars.',
        },
        email: {
            required: 'Email is required.',
            minlength: 'Email is required to be minimum 3 chars.',
            maxlength: 'Email is required to be maximum 80 chars.',
            pattern: 'Email is required to be a valid email.',
            remote: 'This email address already exists.'
        },
        mobile: {
            required: 'Mobile number is required.',
            pattern: 'Mobile number is required to be a valid number.',
        },
        password: {
            required: 'Veterinary License Number is required.',
        },
        confirm_password: {
            required: 'Veterinary License Number is required.',
        }
    },


    VENDOR_ADD_SUCCESS: "Vendor added successfully.",
    VENDOR_NOT_EXISTS : "Vendor not exists.",
    VENDOR_UPDATED_SUCCESS: 'Vendor updated successfully.',
    VENDOR_STATUS_UPDATED: 'Vendor updated successfully.',
    VENDOR_DELETE_SUCCESS: 'Vendor deleted successfully.',
    VENDOR_ADD_FORM: {
        vendor_type: {
            required: 'Vendor Type is required.'
        },
        operation_area: {
            required: 'Vendor Operation Area is required.'
        },
        business_name: {
            required: 'Vendor Business Name is required.',
            minlength: 'Business Name is required to be minimum 3 chars.',
            maxlength: 'Business Name is required to be maximum 50 chars.',
        },
        owner_name: {
            required: 'Admin Name is required.',
            minlength: 'Admin Name is required to be minimum 3 chars.',
            maxlength: 'Admin Name is required to be maximum 30 chars.',
        },
        email: {
            required: 'Email is required.',
            minlength: 'Email is required to be minimum 3 chars.',
            maxlength: 'Email is required to be maximum 80 chars.',
            pattern: 'Email is required to be a valid email.',
            remote: 'This email address already exists.'
        },
        mobile: {
            required: 'Mobile number is required.',
            pattern: 'Mobile number is required to be a valid number.',
        },
        password: {
            required: 'Password is required.',
        },
        confirm_password: {
            required: 'Confirm Password is required.',
        }
    },
    


    CONCIERGE_ADD_SUCCESS: "Concierge added successfully.",
    CONCIERGE_NOT_EXISTS : "Concierge not exists.",
    CONCIERGE_UPDATED_SUCCESS: 'Concierge updated successfully.',
    CONCIERGE_STATUS_UPDATED: 'Concierge updated successfully.',
    CONCIERGE_DELETE_SUCCESS: 'Concierge deleted successfully.',
    CONCIERGE_ADD_FORM: {
        concierge_type: {
            required: 'Concierge Type is required.'
        },
        first_name: {
            required: 'First Name is required.',
            minlength: 'First Name is required to be minimum 3 chars.',
            maxlength: 'First Name is required to be maximum 50 chars.',
        },
        last_name: {
            required: 'Last Name is required.',
            minlength: 'Last Name is required to be minimum 3 chars.',
            maxlength: 'Last Name is required to be maximum 30 chars.',
        },
        email: {
            required: 'Email is required.',
            minlength: 'Email is required to be minimum 3 chars.',
            maxlength: 'Email is required to be maximum 80 chars.',
            pattern: 'Email is required to be a valid email.',
            remote: 'This email address already exists.'
        },
        mobile: {
            required: 'Mobile number is required.',
            pattern: 'Mobile number is required to be a valid number.',
        },
        password: {
            required: 'Password is required.',
        },
        confirm_password: {
            required: 'Confirm Password is required.',
        }
    },

    DELIVERY_ADDRESS_ADD:"Address added successfully.",
    DELIVERY_ADDRESS_EDIT:"Address edited successfully.",

    CART_CLEAR_SUCCESS:"Cart clear successfully.",
    PRODUCT_REMOVE_FROM_CART:"Product removed from cart",
    SUCCESS:"Success",

    ADDRESS_KEY_EXISTS:"Address type already exists",

    STATIC_PAGE_EDIT: {
        title: {
            required: 'Page title is required',
            minlength: 'Page title is required to be minimum 3 chars',
            maxlength: 'Page title is required to be maximum 30 chars',
        }
    },
    ADMIN_LOGIN_FORM: {
        email: {
            required: 'Email is required.',
            minlength: 'Email is required to be minimum 3 chars.',
            maxlength: 'Email is required to be maximum 80 chars.',
        },
        password: {
            required: 'Password is required.',
        },
    },
    ADMIN_FORGOT_PASSWORD_FORM: {
        email: {
            required: 'Email is required.',
            minlength: 'Email is required to be minimum 3 chars.',
            maxlength: 'Email is required to be maximum 80 chars.',
        },
    },
    ADMIN_RESET_PASSWORD_FORM: {
        newPassword: {
            required: 'Password is required.',
            pattern: 'Password must contain at least 8 characters with at least 1 alphabet and 1 digit.'
        },
        otp: {
            required: 'OTP is required.',
            minlength: 'OTP is required to be minimum 4 chars.',
            maxlength: 'OPT is required to be maximum 4 chars.',
        },
    },
    PROFILE_FORM: {
        firstName: {
            required: 'First name is required.',
            minlength: 'First name is required to be minimum 3 chars.',
            maxlength: 'First name is required to be minimum 30 chars.',
        },
        lastName: {
            required: 'Last name is required.',
            minlength: 'Last name is required to be minimum 3 chars.',
            maxlength: 'Last name is required to be minimum 30 chars.',
        },
        email: {
            required: 'Email is required.',
            minlength: 'Email is required to be minimum 3 chars.',
            maxlength: 'Email is required to be maximum 80 chars.',
            pattern: 'Please enter a valid email.',
            remote: 'This email is already Exists.',
        },
        contactNumber: {
            required: 'Contact number is required.',
            pattern: 'Contact number is required to be a valid number.',
        },
    },
    CHANGE_PASSWORD: {
        currentPassword: {
            required: 'Current password is required.',
        },
        newPassword: {
            required: 'New password is required.',
            minlength: 'New password is required to be minimum 8 chars.',
            maxlength: 'New password is required to be maximum 30 chars.',
            pattern: 'New password must contain at least 1 alphabet and 1 digit.',
        },
        confirmPassword: {
            required: 'Password is required.',
            equalTo: 'Confirm Password must match new password.',
        },
    },
    CHANGE_SETTINGS: {
        androidAppVersion: {
            required: 'Android app version is required.',
            pattern: 'Android app version is required to be a semantic version.'
        },
        iosAppVersion: {
            required: 'iOS app version is required.',
            pattern: 'iOS app version is required to be a semantic version.'
        },
        androidForceUpdate:{
            required: 'Android force update is required'
        },
        iosForceUpdate:{
            required: 'iOS force update is required'
        }
    },
    ADD_CATEGORIES_FORM: {
        name: {
            required: 'Name is required.',
            minlength: 'Name is required to be minimum 3 chars.',
            maxlength: 'Name is required to be maximum 30 chars.',
            pattern: 'Name may contain alphabet\'s, number and space only .'
        }
    },

    MOBILE_EXISTS:'Contact number already exists',
    EMAIL_EXISTS:'Email is already exists.',
    MOBILE_NO_EXISTS:'Mobile number already exists',

    monday:"Monday",
    tuesday:"Tuesday",
    wednesday:"Wednesday",
    thursday:"Thursday",
    friday:"Friday",
    saturday:"Saturday",
    sunday:"Sunday"

};

const validationKeys = {
    firstName: 'First name',
    lastName: 'Last name',
    email: 'Email Address',
    contactNumber: 'Contact number',
    password: 'Password',
    currentPassword: 'Current Password',
    newPassword: 'New Password',
    confirmPassword: 'Confirm Password',
    emailPattern: 'a valid email address',
    passwordPattern: 'at least 8 characters with at least 1 alphabet and 1 digit',
    contactNumberPattern: 'a valid number',
    countryCodePattern: 'plus sign followed by digits',
    mobilePattern: 'only digits',
    phonePattern: 'only digits',
    otpPattern: 'only digits',
    numberPattern: 'only digits',
    name: 'Name',
    title: 'Title',
    description: 'Description',
    dateFrom: 'From date',
    dateTo: 'To date',
    countryCode: 'Country code',
    mobile: 'Mobile',
    address: 'Address',
    age: 'Age',
    gender: 'Gender',
    vehicleType: 'Vehicle type',
    licenceNo: 'Licence Number',
    licenceIssuedAt: 'Licence issued at',
    licenceExpiresOn: 'Licence expires on',
};

const key = keyName => validationKeys[keyName.replace(/\.[\d]+/, '')] || keyName;

/**
 * @see https://github.com/hapijs/joi/blob/master/lib/language.js
 */
const validationMessages = {
    any: {
        required: ({ path }) => `${key(path.join('.'))} is required.`,
        unknown: ({ path }) => `${key(path.join('.'))} is not allowed.`,
        invalid: ({ path }) => `${key(path.join('.'))} contains an invalid value.`,
        empty: ({ path }) => `${key(path.join('.'))} is required.`,
        allowOnly: ({ context, path }) =>
            `${key(path.join('.'))} must be one of ${context.valids.map(item => key(item)).join(', ')}`,
    },

    string: {
        regex: {
            name: ({ context, path }) => `${key(path.join('.'))} must contain ${key(context.name)}`,
        },
        min: ({ context, path }) => `${key(path.join('.'))} must be at least ${context.limit} characters in length.`,
        max: ({ context, path }) => `${key(path.join('.'))} must be under ${context.limit} characters in length.`,
        hex: ({ path }) => `${key(path.join('.'))} must only contain hexadecimal characters.`,
        length: ({ path }) => `${key(path.join('.'))} length must be 4 characters long.`,
    },

    number: {
        base: ({ path }) => `${key(path.join('.'))} must be a number`,
        min: ({ context, path }) => `${key(path.join('.'))} must be larger than or equal to ${context.limit}.`,
        max: ({ context, path }) => `${key(path.join('.'))} must be less than or equal to ${context.limit}.`,
    },

    objectId: {
        valid: ({ path }) => `${key(path.join('.'))} needs to be a valid Object ID`,
    },

    object: {
        base: ({ path }) => `${key(path.join('.'))} must be an object`,
        xor: ({ context }) => `only one of ${context.peers.map(peer => key(peer)).join(', ')} is allowed.`,
        with: ({ context }) => `${key(context.peer)} is required with ${key(context.main)}.`,
        without: ({ context }) => `${key(context.peer)} needs to be removed with ${key(context.main)}.`,
        and: ({ context }) =>
            `${context.missing.map(peer => key(peer)).join(', ')} required with ${context.present
                .map(peer => key(peer))
                .join(', ')}.`,
    },

    array: {
        min: ({ path, context }) => `${key(path.join('.'))} must contain at least ${context.limit} items.`,
        max: ({ path, context }) => `${key(path.join('.'))} must contain at most ${context.limit} items.`,
    },

    custom: {
        sameAs: (key1, key2) => `${key(key1)} must match the ${key(key2)} field.`,
    },

    date: {
        valid: key1 => `${key(key1)} needs to be a valid date`,
    },
};

locale.validationKeys = validationKeys;
locale.validation = validationMessages;

module.exports = Object.freeze(locale);
