export default {
  items: [
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: 'icon-speedometer',
      badge: {
        variant: 'info',
        text: 'HOME'
      }
    },
    {
      title: true,
      name: 'UI elements',
      wrapper: {            // optional wrapper object
        element: '',        // required valid HTML5 element tag
        attributes: {}        // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
      },
      class: ''             // optional class names space delimited list for title item ex: "text-center"
    },
    {
      name: 'Language Selection',
      url: '/icons',
      icon: 'icon-calculator',
      children: [
        {
          name: 'JavaScript',
          url: '/icons/font-awesome',
          icon: 'icon-calculator',
        },
        {
          name: 'Python',
          url: '/icons/simple-line-icons',
          icon: 'icon-star'
        }
      ]
    },
    {
      name: 'School Contacts',
      url: '/charts',
      icon: 'icon-pie-chart'
    },
    {
      divider: true
    },
    {
      title: true,
      name: 'Extras'
    },
    {
      name: 'Pages',
      url: '/pages',
      icon: 'icon-star',
      children: [
        {
          name: 'Medium',
          url: 'https://medium.com/',
          icon: 'icon-feed'
        },
        {
          name: 'TechCrunch',
          url: 'https://techcrunch.com/',
          icon: 'icon-feed'
        },
        {
          name: 'BBC News',
          url: 'http://www.bbc.com/news/technology',
          icon: 'icon-feed'
        }
      ]
    }
  ]
};
