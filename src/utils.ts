export const debounce = (cb: any, delay: number) => {
  // A timer variable to track the delay period
  let timer: ReturnType<typeof setTimeout> | undefined = undefined

  // Return a function that takes arguments
  return function (...args: any[]) {
    // Clear the previous timer if any
    clearTimeout(timer)

    // Set a new timer that will execute the function after the delay period
    timer = setTimeout(() => {
      // Apply the function with arguments
      cb(...args)
    }, delay)
  }
}
