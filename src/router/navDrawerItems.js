let navDrawerItems = [
  // {icon: 'mdi-lightbulb-outline', label: 'Notes'},
  // {icon: 'mdi-reminder', label: 'Reminders'},
  // {divider: true},
  {heading: 'Documents'},
  {
    icon: 'mdi-file-document-box-multiple',
    label: 'Components',
    to: '/documents/components'
  },
  {
    icon: 'mdi-function',
    label: 'Functions',
    to: '/documents/functions'
  },
  {
    icon: 'mdi-function-variant',
    label: 'Store',
    to: '/documents/store'
  },
  {divider: true},
  {heading: 'Debug'},
  {
    icon: 'mdi-share-variant',
    label: 'Test Router',
    children: [
      {icon: 'mdi-numeric-1', label: 'Test Router 1', to: '/test-router-parent/test-router-1'},
      {icon: 'mdi-numeric-2', label: 'Test Router 2', to: '/test-router-parent/test-router-2'},
      {icon: 'mdi-numeric-3', label: 'Test Router 3', to: '/test-router-parent/test-router-3'},
    ]
  },
  {
    access: ['Re'],
    hidden: true,
    icon: 'mdi-cellphone-android',
    label: 'Test Component',
    to: '/test-components/test-component-page'
  }
]
export {navDrawerItems}
