'use client'

import { redirect } from 'next/navigation'

// Redirect /menu to home page since menu is displayed on home
export default function MenuPage() {
  redirect('/')
}
