<template>
  <div>
    <h1>Add Book</h1>
    <form @submit.prevent="addBook">
      <div>
        <label for="isbn">ISBN:</label>
        <input type="text" v-model.trim="isbn" id="isbn" required />
      </div>
      <div>
        <label for="name">Name:</label>
        <input type="text" v-model.trim="name" id="name" required />
      </div>
      <button type="submit">Add Book</button>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue'
import db from '../firebase/init.js'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

export default {
  setup() {
    const isbn = ref('')
    const name = ref('')

    
    const isValidISBN = (raw) => {
      if (!raw) return false
      const cleaned = raw.replace(/-/g, '')
      if (!/^\d+$/.test(cleaned)) return false
      return cleaned.length === 10 || cleaned.length === 13
    }

    const addBook = async () => {
      try {
        const isbnStr = (isbn.value || '').trim()
        const nameStr = (name.value || '').trim()

        if (!isValidISBN(isbnStr)) {
          alert('Please enter a valid ISBN-10 or ISBN-13 (digits and optional hyphens).')
          console.error('Invalid ISBN:', isbnStr)
          return
        }
        if (!nameStr) {
          alert('Name cannot be empty.')
          return
        }

        await addDoc(collection(db, 'books'), {
          isbn: isbnStr,           
          name: nameStr,
          createdAt: serverTimestamp(),
        })

        isbn.value = ''
        name.value = ''
        alert('Book added successfully!')
      } catch (error) {
        console.error('Error adding book:', error)
        alert('Failed to add book. Please try again.')
      } finally {
        console.log('addBook finished')
      }
    }

    
    return { isbn, name, addBook }
  },
}
</script>

<style></style>

