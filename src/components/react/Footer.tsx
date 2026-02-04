export default function Footer() {
  const today = new Date();
  return (
    <footer className="bg-[linear-gradient(var(--gray-gradient))_no-repeat] px-4 pt-8 pb-24 text-center text-[rgb(var(--gray))]">
      &copy; {today.getFullYear()} tantuyu. All rights reserved.
    </footer>
  );
}
