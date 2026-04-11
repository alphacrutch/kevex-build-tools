import { defineStore } from 'pinia'
import {
  createUserWithEmailAndPassword,
  getAdditionalUserInfo,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile
} from 'firebase/auth'
import { auth } from '@/boot/firebase'

const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({ prompt: 'select_account' })

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: false,
    initialized: false,
    initPromise: null
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.user),
    userId: (state) => state.user?.uid ?? null
  },
  actions: {
    init() {
      if (this.initPromise) {
        return this.initPromise
      }

      this.initPromise = new Promise((resolve) => {
        onAuthStateChanged(auth, (user) => {
          this.user = user ?? null
          this.initialized = true
          resolve(user ?? null)
        })
      })

      return this.initPromise
    },
    async waitForInit() {
      if (this.initialized) {
        return this.user
      }

      return this.init()
    },
    async login(email, password) {
      this.loading = true

      try {
        const credentials = await signInWithEmailAndPassword(auth, email, password)
        this.user = credentials.user
        return credentials.user
      } finally {
        this.loading = false
      }
    },
    async register({ email, password, displayName }) {
      this.loading = true

      try {
        const credentials = await createUserWithEmailAndPassword(auth, email, password)

        if (displayName) {
          await updateProfile(credentials.user, { displayName })
        }

        this.user = auth.currentUser
        return this.user
      } finally {
        this.loading = false
      }
    },
    async loginWithGoogle() {
      this.loading = true

      try {
        const credentials = await signInWithPopup(auth, googleProvider)
        this.user = credentials.user

        return {
          user: credentials.user,
          isNewUser: getAdditionalUserInfo(credentials)?.isNewUser ?? false
        }
      } finally {
        this.loading = false
      }
    },
    async logout() {
      await signOut(auth)
      this.user = null
    }
  }
})
