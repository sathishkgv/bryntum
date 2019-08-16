import LocaleManager from '../../lib/Common/localization/LocaleManager.js';
import '../../lib/Gantt/localization/SvSE.js';

const examplesLocale = {
    extends : 'SvSE',

    Shared : {
        'Locale changed' : 'Språk ändrat'
    }
};

export default examplesLocale;

LocaleManager.extendLocale('SvSE', examplesLocale);
