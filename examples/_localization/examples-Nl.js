import LocaleManager from '../../lib/Common/localization/LocaleManager.js';
import '../../lib/Gantt/localization/Nl.js';

const examplesLocale = {
    extends : 'Nl',

    Shared : {
        'Locale changed' : 'Taal is veranderd'
    }
};

export default examplesLocale;

LocaleManager.extendLocale('Nl', examplesLocale);
