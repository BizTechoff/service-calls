export const terms = {
    appName: 'מנהיגות תורנית',
    appVersion: '2022.07.06.0',
    name: 'שם',
    requiredField: 'חובה',
    uniqueField:'קיים',
    installtionNameRequired: 'תיאור ההתקנה שדה חובה',
    status: 'סטטוס',
    coordinstall: 'תיאום התקנות',
    missions: 'משימות',
    customers: 'לקוחות',
    reports: 'דוח עבודה',
    username: "שם משתמש",
    mobile: 'סלולרי',
    createDate: 'נוצר ב',
    signIn: "כניסה",
    confirmPassword: "אימות סיסמה",
    signUp: "הרשמה",
    signOut: "התנתקות",
    date: "תאריך",
    resetPassword: 'איפוס סיסמה',
    doesNotMatchPassword: "סיסמאות אינן דומות",
    passwordDeletedSuccessful: 'סיסמה אופסה בהצלחה',
    password: 'סיסמה',
    updateInfo: "עדכון פרטים",
    changePassword: "שינוי סיסמה",
    hello: "שלום",
    invalidOperation: "פעולה אינה חוקית",
    admin: 'אדמין',
    manager: 'מנהל',
    bedekManager: 'מנהל בדק',
    bedek:'בדק',
    subContractor:'קבלן משנה',
    tenant:'דייר',
    shluch: 'שליח',
    avrech: 'אברך',
    shluchim: 'שלוחים',
    avrechim: 'אברכים',
    userAccounts: 'משתמשים',
    currentState: 'תצוגת מצב',
    myDetails: 'פרטים שלי',
    myLectures: 'נושאים שלי',
    yes: 'כן',
    update: 'עדכן',
    no: 'לא',
    ok: 'אישור',
    areYouSureYouWouldLikeToDelete: "בטוח למחוק את ",
    cancel: 'ביטול',
    home: 'ברוכים הבאים',
    users: 'משתמשים',
    professionals:'בעלי מקצוע',
    tenants:'דיירים',
    requests: 'פניות',
    projects:'פרויקטים',
    complexes:'מתחמים',
    buildings:'בניינים',
    apartments:'דירות',
    inspectors:'מפקחים',
    workManager:'מנהלי עבודה',
    subContractors:'קבלני משנה',
    welcome: 'ברוכים הבאים',
    invalidSignIn: 'פרטי התחברות שגויים',
    invalidSignUp:'שגיאה בהרשמה',
    rememberOnThisDevice: 'זכור אותי',
    passwordDeleteConfirmOf: 'בטוח לאפס סיסמה ל: ',
    addUser: 'הוספת משתמש',
    addShluch: 'הוספת שליח',
    addAvrech: 'הוספת אברך',
    addCourse: 'הוספת קורס',
    addLecture: 'הוספת נושא',
    sendSigninDetails: 'שלח פרטי התחברות',

    confirmisDevice: "זכור אותי במכשיר זה?"
}

declare module 'remult' {
    export interface UserInfo {
        isAdmin: boolean;
        isBedekManager: boolean;
        isBedek: boolean;
        isBuildingManager: boolean;
        isProfessional: boolean;
        isTenant: boolean;
        isInspector: boolean;
        group:string
    }
}
