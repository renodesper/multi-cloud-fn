const { postRequest } = require('core')

exports.handler = async (event) => {
  try {
    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body
    const result = await postRequest(body)

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, data: result }),
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: err.message }),
    }
  }
}
