export default {
  items: [
    {
      name: 'Dashboard',
      url: '/student',
      icon: 'icon-speedometer',
      badge: {
        variant: 'info',
        text: 'HOME'
      }
    },
    {
      title: true,
      name: 'Support',
      wrapper: {            // optional wrapper object
        element: '',        // required valid HTML5 element tag
        attributes: {}        // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
      },
      class: ''             // optional class names space delimited list for title item ex: "text-center"
    },
    {
      name: 'CodeCombat Progress',
      url: '/forum',
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
