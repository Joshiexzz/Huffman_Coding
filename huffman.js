// Utility function to build a frequency map of the characters
function buildFrequencyMap(text) {
    const freqMap = {}
    for (const char of text) {
      freqMap[char] = (freqMap[char] || 0) + 1
    }
    return freqMap
  }
  
  // Function to create a min heap
  class MinHeap {
    constructor() {
      this.heap = []
    }
  
    insert(node) {
      this.heap.push(node)
      this.heapifyUp()
    }
  
    extractMin() {
      if (this.heap.length === 0) return null
      const minNode = this.heap[0]
      const lastNode = this.heap.pop()
      if (this.heap.length > 0) {
        this.heap[0] = lastNode
        this.heapifyDown()
      }
      return minNode
    }
  
    heapifyUp() {
      let index = this.heap.length - 1
      while (index > 0) {
        const parentIndex = Math.floor((index - 1) / 2)
        if (this.heap[index].freq >= this.heap[parentIndex].freq) break
        ;[this.heap[index], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[index]]
        index = parentIndex
      }
    }
  
    heapifyDown() {
      let index = 0
      const length = this.heap.length
      while (index < length) {
        const leftChild = 2 * index + 1
        const rightChild = 2 * index + 2
        let smallest = index
  
        if (leftChild < length && this.heap[leftChild].freq < this.heap[smallest].freq) {
          smallest = leftChild
        }
        if (rightChild < length && this.heap[rightChild].freq < this.heap[smallest].freq) {
          smallest = rightChild
        }
  
        if (smallest === index) break
        ;[this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]]
        index = smallest
      }
    }
  
    size() {
      return this.heap.length
    }
  }
  
  // Huffman Tree Node
  class HuffmanNode {
    constructor(char, freq) {
      this.char = char
      this.freq = freq
      this.left = null
      this.right = null
    }
  }
  
  // Build Huffman Tree
  function buildHuffmanTree(freqMap) {
    const minHeap = new MinHeap()
    for (const char in freqMap) {
      minHeap.insert(new HuffmanNode(char, freqMap[char]))
    }
  
    while (minHeap.size() > 1) {
      const left = minHeap.extractMin()
      const right = minHeap.extractMin()
      const merged = new HuffmanNode(null, left.freq + right.freq)
      merged.left = left
      merged.right = right
      minHeap.insert(merged)
    }
  
    return minHeap.extractMin()
  }
  
  // Generate Huffman Codes from the Tree
  function generateHuffmanCodes(root, prefix = "", codes = {}) {
    if (!root) return codes
    if (root.char !== null) {
      codes[root.char] = prefix
    }
    generateHuffmanCodes(root.left, prefix + "0", codes)
    generateHuffmanCodes(root.right, prefix + "1", codes)
    return codes
  }
  
  // Huffman Encoding with bit-level packing
  function huffmanEncode(text) {
    const freqMap = buildFrequencyMap(text)
    const huffmanTree = buildHuffmanTree(freqMap)
    const huffmanCodes = generateHuffmanCodes(huffmanTree)
  
    let encodedBits = ""
    for (const char of text) {
      encodedBits += huffmanCodes[char]
    }
  
    // Pad the encoded bits to ensure full bytes
    const padding = 8 - (encodedBits.length % 8)
    encodedBits = encodedBits.padEnd(encodedBits.length + padding, "0")
  
    // Convert bit string to Uint8Array
    const encodedBytes = new Uint8Array(encodedBits.length / 8)
    for (let i = 0; i < encodedBits.length; i += 8) {
      encodedBytes[i / 8] = Number.parseInt(encodedBits.substr(i, 8), 2)
    }
  
    return { encodedBytes, huffmanCodes, padding }
  }
  
  // Huffman Decoding with bit-level unpacking
  function huffmanDecode(encodedBytes, huffmanCodes, padding) {
    const reverseCodes = Object.fromEntries(Object.entries(huffmanCodes).map(([key, value]) => [value, key]))
    let decodedText = ""
    let currentCode = ""
  
    for (let i = 0; i < encodedBytes.length; i++) {
      let byte = encodedBytes[i].toString(2).padStart(8, "0")
      if (i === encodedBytes.length - 1) {
        byte = byte.slice(0, -padding)
      }
      for (const bit of byte) {
        currentCode += bit
        if (reverseCodes[currentCode]) {
          decodedText += reverseCodes[currentCode]
          currentCode = ""
        }
      }
    }
  
    return decodedText
  }
  
  // Serialize Huffman codes for storage
  function serializeHuffmanCodes(huffmanCodes) {
    return JSON.stringify(huffmanCodes)
  }
  
  // Deserialize Huffman codes
  function deserializeHuffmanCodes(serializedCodes) {
    return JSON.parse(serializedCodes)
  }
  
  // File handling (Upload and Download)
  function handleFileUpload(event) {
    const file = event.target.files[0]
    if (!file) return
  
    const reader = new FileReader()
    reader.onload = (e) => {
      const fileContent = e.target.result
      const { encodedBytes, huffmanCodes, padding } = huffmanEncode(fileContent)
  
      // Prepare metadata
      const serializedCodes = serializeHuffmanCodes(huffmanCodes)
      const metadataLength = new Uint32Array([serializedCodes.length])
      const paddingInfo = new Uint8Array([padding])
  
      // Combine metadata and encoded data
      const combinedData = new Uint8Array(4 + 1 + metadataLength[0] + encodedBytes.length)
      combinedData.set(new Uint8Array(metadataLength.buffer), 0)
      combinedData.set(paddingInfo, 4)
      combinedData.set(new TextEncoder().encode(serializedCodes), 5)
      combinedData.set(encodedBytes, 5 + metadataLength[0])
  
      // Save compressed file as .huff
      const compressedBlob = new Blob([combinedData], { type: "application/octet-stream" })
      const downloadLink = document.createElement("a")
      downloadLink.href = URL.createObjectURL(compressedBlob)
      downloadLink.download = "compressed.huff"
      downloadLink.click()
  
      // Show the Huffman codes on the page
      displayHuffmanCodes(huffmanCodes)
  
      // Enable the download decoded button
      const downloadButton = document.getElementById("downloadButton")
      downloadButton.style.display = "inline-block"
      downloadButton.onclick = () => downloadDecodedFile(combinedData)
    }
  
    reader.readAsText(file)
  }
  
  function downloadDecodedFile(combinedData) {
    // Extract metadata and encoded data
    const metadataLength = new Uint32Array(combinedData.buffer.slice(0, 4))[0]
    const padding = combinedData[4]
    const serializedCodes = new TextDecoder().decode(combinedData.slice(5, 5 + metadataLength))
    const encodedBytes = combinedData.slice(5 + metadataLength)
  
    // Deserialize Huffman codes
    const huffmanCodes = deserializeHuffmanCodes(serializedCodes)
  
    // Decode the data
    const decodedText = huffmanDecode(encodedBytes, huffmanCodes, padding)
  
    // Create and trigger download of decoded file
    const decodedBlob = new Blob([decodedText], { type: "text/plain" })
    const decodedLink = document.createElement("a")
    decodedLink.href = URL.createObjectURL(decodedBlob)
    decodedLink.download = "decoded.txt"
    decodedLink.click()
  }
  
  function displayHuffmanCodes(codes) {
    const codesDiv = document.getElementById("huffmanCodes")
    codesDiv.innerHTML = "<h3>Huffman Codes:</h3>"
    for (const [char, code] of Object.entries(codes)) {
      const p = document.createElement("p")
      p.textContent = `${char}: ${code}`
      codesDiv.appendChild(p)
    }
  }
  
  // Handle file upload
  document.getElementById("fileInput").addEventListener("change", handleFileUpload)
  
  