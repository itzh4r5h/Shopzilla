const icons = import.meta.glob("../assets/category_icons/*.svg", { eager: true });

export const category_icons = Object.fromEntries(
  Object.entries(icons).map(([path, module]) => {
    const name = path.split("/").pop().replace(".svg", ""); // e.g. "apple"
    return [name, module.default];
  })
);

/*
1. Object.entries(icons)

👉 Turns the object into an array of key–value pairs:

[
  ["./icons/apple.svg", { default: "apple.svg-url" }],
  ["./icons/bag.svg", { default: "bag.svg-url" }]
]

2. .map(([path, module]) => { ... })

👉 Loops over each pair.

path = "./icons/apple.svg"

module = { default: "apple.svg-url" }

Inside we do:

const name = path.split("/").pop().replace(".svg", "");


path.split("/") → [".", "icons", "apple.svg"]

.pop() → "apple.svg" (takes last part)

.replace(".svg", "") → "apple"

✅ Now we got a clean name.

Then we return a new pair:

return [name, module.default];


For apple → ["apple", "apple.svg-url"]
For bag → ["bag", "bag.svg-url"]

So after .map() we have:

[
  ["apple", "apple.svg-url"],
  ["bag", "bag.svg-url"]
]

3. Object.fromEntries(...)

👉 Converts that array of pairs back into an object:

{
  apple: "apple.svg-url",
  bag: "bag.svg-url"
}


✅ Final result is a clean object you can use like:

category_icons.apple // "apple.svg-url"
category_icons.bag   // "bag.svg-url"

*/