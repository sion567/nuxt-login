export default defineEventHandler((event) => {
  if (event.path === '/') {
    console.log("goto dashboard [302]");
    //return sendRedirect(event, '/dashboard', 302)
  }
})