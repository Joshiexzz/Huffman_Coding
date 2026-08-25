# Huffman Coding

A simple web-based file compression and decompression project using the **Huffman Coding algorithm**. The application allows users to upload a text file, compress it using Huffman encoding, view the generated Huffman codes, and download the decoded file.

## Features

* Upload text files
* Calculate character frequencies
* Build a Huffman Tree
* Generate Huffman codes
* Compress text into a `.huff` file
* Display generated Huffman codes
* Decode compressed data
* Download the decoded text file
* Runs directly in the web browser

## Technologies Used

* HTML5
* CSS3
* JavaScript
* FileReader API
* Uint8Array
* Blob API

## Project Structure

```text
Huffman_Coding/
├── index.html
├── huffman.js
└── README.md
```

## How It Works

The application follows the standard Huffman Coding process:

1. Read the uploaded text file.
2. Calculate the frequency of each character.
3. Store the characters in a Min Heap.
4. Build the Huffman Tree by repeatedly combining the two nodes with the lowest frequencies.
5. Generate binary Huffman codes by traversing the tree.
6. Encode the original text using the generated codes.
7. Pack the encoded bits into bytes.
8. Store the Huffman codes and encoded data in a `.huff` file.
9. Decode the compressed data when requested.
10. Download the reconstructed text as a `.txt` file.

The core implementation includes a frequency map, Min Heap, Huffman Tree, encoding, decoding, and metadata handling.

## Usage

### 1. Clone the Repository

```bash
git clone https://github.com/Joshiexzz/Huffman_Coding.git
```

### 2. Open the Project

Open the project folder and run `index.html` in a web browser.

You can also use **VS Code with Live Server**.

### 3. Compress a File

Click **Choose a file** and select a text file.

The application will:

* Read the file
* Generate Huffman codes
* Compress the content
* Download `compressed.huff`
* Display the generated Huffman codes

### 4. Decode the File

After compression, click **Download Decoded** to reconstruct and download the original text as `decoded.txt`.

## Huffman Coding

Huffman Coding is a **lossless data compression algorithm** that assigns shorter binary codes to frequently occurring characters and longer codes to less frequent characters.

For example:

```text
Character    Frequency
A            5
B            3
C            2
D            1
```

The characters are organized into a Huffman Tree, from which the binary codes are generated.

```text
Left  → 0
Right → 1
```

## Algorithm

The main components of the implementation are:

* `buildFrequencyMap()` — calculates character frequencies.
* `MinHeap` — manages nodes based on frequency.
* `buildHuffmanTree()` — constructs the Huffman Tree.
* `generateHuffmanCodes()` — generates binary codes.
* `huffmanEncode()` — compresses the input text.
* `huffmanDecode()` — reconstructs the original text.
* `handleFileUpload()` — handles file input and compression.
* `downloadDecodedFile()` — creates the decoded text file.

## Limitations

* Currently designed for text files.
* The `.huff` format is specific to this implementation.
* Compression and decompression are performed in the browser.

## Future Improvements

* Add compression ratio and file size information.
* Support additional file formats.
* Add support for decoding existing `.huff` files.
* Improve performance for large files.
* Add Huffman Tree visualization.
* Improve the user interface and mobile support.

## Author

**Abhinav Joshi**

GitHub: [Joshiexzz](https://github.com/Joshiexzz)

## License

This project is created for educational purposes.
