const locale = {
   localeEnable: 'vi',
   vi: {
   }
}

export default (): Record<string, any> => ({
   getLocale: () => {
      return locale[locale.localeEnable]
   }
})


  