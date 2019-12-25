const socket = io()
const $form1 = document.querySelector('#form1')
const $input1 = document.querySelector('#input1')
const $sharelocation = document.querySelector('#sharelocation')
const $messagetemplate = document.querySelector('#message-template').innerHTML
const $locationtemplate = document.querySelector('#location-template').innerHTML
const $messageDisplay = document.querySelector('#messages')


const { username, roomname } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoscroll = () => {

    //New message element
    $newMessage = $messageDisplay.lastElementChild

    //Height of the last message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageheight = $newMessage.offsetHeight + newMessageMargin

    //visible height
    const visibleHeight = $messageDisplay.offsetHeight

    const containHeight = $messageDisplay.scrollHeight

    //How far to scroll

    const scrolloffSet = $messageDisplay.scrollTop + visibleHeight

    if (containHeight - newMessageheight <= scrolloffSet) {

        $messageDisplay.scrollTop = $messageDisplay.scrollHeight

    }
}

socket.on('message', (m1) => {
    console.log(m1)

    const html = Mustache.render($messagetemplate, {
        username: m1.username,
        message: m1.text,
        createdAt: m1.createdAt

    })
    $messageDisplay.insertAdjacentHTML('beforeend', html)

    autoscroll()
})

socket.on('location-message', (url) => {

    const html = Mustache.render($locationtemplate, {
        username: url.username,
        url: url.url,
        createdAt: url.createdAt
    })

    $messageDisplay.insertAdjacentHTML('beforeend', html)
    autoscroll()
})


$form1.addEventListener('submit', (e) => {
    e.preventDefault()

    //disable the form
    $form1.setAttribute('disabled', 'disabled')


    socket.emit('sendMessage', $input1.value, (error) => {
        //enable the form
        $form1.removeAttribute('disabled')
        $input1.value = ''
        $form1.focus()

        if (error) {
            return console.log(error)
        }

        console.log('Message Sent')
    })
})

$sharelocation.addEventListener('click', () => {

    $sharelocation.setAttribute('disabled', 'disabled')

    if (!navigator.geolocation) {
        return alert('This feature is not supported by your browser')
    }

    navigator.geolocation.getCurrentPosition((position) => {

        $sharelocation.removeAttribute('disabled')

        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            console.log('Location Shared!')
        })
    })
})

socket.emit('join', { username, roomname }, (error) => {

    console.log(error)
})