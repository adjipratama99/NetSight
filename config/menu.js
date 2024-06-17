export default function getMenu(options) {
    const { isAdmin, isOperator, isUser } = options
    const mainmenu = [
        {
            label: 'Dashboard',
            accessKey: 'dashboard',
            link: '/dashboard'
        }
    ]

    return [
        {
            type: 'group',
            name: 'Main Menu',
            accessList: [
                'dashboard'
            ],
            children: mainmenu
        }
    ]
}